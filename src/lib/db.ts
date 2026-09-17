import fs from 'node:fs/promises';
import path from 'node:path';
import { nanoid } from 'nanoid';
import { z } from 'astro/zod';
import { calculateEloRating } from './elo';
import { terminationKeys } from './terminations';

export const gameResults = ['1-0', '0-1', '1/2-1/2'] as const;

export type GameResult = (typeof gameResults)[number];

export const startingRating = 800;

const gamePlayerSchema = z.object({
  name: z.string(),
  fullName: z.string(),
  rating: z.number(),
});

const chessGameSchema = z.object({
  id: z.string(),
  datetime: z.string(),
  timeControl: z.string(),
  url: z.string().nullable(),
  description: z.string().nullable(),
  white: gamePlayerSchema,
  black: gamePlayerSchema,
  result: z.enum(gameResults),
  termination: z.enum(terminationKeys),
  ratingChange: z.object({
    white: z.number(),
    black: z.number(),
  }),
  pgn: z.string().nullable(),
});

const playerSchema = gamePlayerSchema.extend({
  games: z.array(z.object({
    gameId: z.string(),
    newRating: z.number(),
  })),
});

export type GamePlayer = z.infer<typeof gamePlayerSchema>;
export type ChessGame = z.infer<typeof chessGameSchema>;
export type Player = z.infer<typeof playerSchema>;

const dataDir = process.env.SASKY_DATA_DIR ?? 'data';
const gamesPath = path.join(dataDir, 'games.json');
const playersPath = path.join(dataDir, 'players.json');

export const loadGames = async (): Promise<ChessGame[]> => {
  const raw = await fs.readFile(gamesPath, 'utf-8');
  return z.array(chessGameSchema).parse(JSON.parse(raw));
};

export const loadPlayers = async (): Promise<Player[]> => {
  const raw = await fs.readFile(playersPath, 'utf-8');
  return z.array(playerSchema).parse(JSON.parse(raw));
};

export const saveGames = async (games: ChessGame[]): Promise<void> => {
  await fs.writeFile(gamesPath, JSON.stringify(games, null, 2), 'utf-8');
};

export const savePlayers = async (players: Player[]): Promise<void> => {
  await fs.writeFile(playersPath, JSON.stringify(players, null, 2), 'utf-8');
};

export const getPlayerByName = (players: Player[], name: string): Player | null => {
  return players.find((player) => player.name === name) ?? null;
};

const sortGamesByDateDescending = (games: ChessGame[]): ChessGame[] => {
  return [...games].sort(
    (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
  );
};

const scoreFor = (result: GameResult, colour: 'white' | 'black'): number => {
  if (result === '1/2-1/2') {
    return 0.5;
  }
  const winner = result === '1-0' ? 'white' : 'black';
  return winner === colour ? 1 : 0;
};

const applyGameToRatings = (game: ChessGame, white: Player, black: Player): void => {
  const newWhiteRating = calculateEloRating(
    white.rating,
    black.rating,
    scoreFor(game.result, 'white'),
  );
  const newBlackRating = calculateEloRating(
    black.rating,
    white.rating,
    scoreFor(game.result, 'black'),
  );

  game.ratingChange.white = newWhiteRating - white.rating;
  game.ratingChange.black = newBlackRating - black.rating;
  game.white.rating = newWhiteRating;
  game.black.rating = newBlackRating;

  white.rating = newWhiteRating;
  black.rating = newBlackRating;
  white.games.push({ gameId: game.id, newRating: newWhiteRating });
  black.games.push({ gameId: game.id, newRating: newBlackRating });
};

export const recalculateRatings = async (
  games: ChessGame[],
  players: Player[],
): Promise<ChessGame[]> => {
  const sorted = sortGamesByDateDescending(games);

  for (const player of players) {
    player.rating = startingRating;
    player.games = [];
  }

  for (const game of [...sorted].reverse()) {
    const white = getPlayerByName(players, game.white.name);
    const black = getPlayerByName(players, game.black.name);

    if (white === null || black === null) {
      throw new Error(`Player not found: ${game.white.name} or ${game.black.name}`);
    }

    applyGameToRatings(game, white, black);
  }

  await saveGames(sorted);
  await savePlayers(players);
  return sorted;
};

export const saveGame = async (game: Omit<ChessGame, 'id'>): Promise<ChessGame> => {
  const games = await loadGames();
  const players = await loadPlayers();
  const newGame: ChessGame = { ...game, id: nanoid(8) };

  games.push(newGame);
  await recalculateRatings(games, players);
  return newGame;
};

let ratingsPass: Promise<void> | null = null;

const runRatingsPass = async (): Promise<void> => {
  const games = await loadGames();
  const players = await loadPlayers();
  console.log(`Loaded ${games.length} games and ${players.length} players from the database.`);
  await recalculateRatings(games, players);
  console.log('Player ratings recalculated.');
};

export const ensureRatingsUpToDate = (): Promise<void> => {
  if (ratingsPass === null) {
    ratingsPass = runRatingsPass();
  }
  return ratingsPass;
};
