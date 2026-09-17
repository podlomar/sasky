import { asc, desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { calculateEloRating } from './elo';
import { getDb } from './database';
import { games, players } from './schema';
import { startingRating, type ChessGame, type GameResult, type Player } from './types';

export { gameResults, startingRating } from './types';
export type {
  ChessGame,
  GamePlayer,
  GameRating,
  GameResult,
  Player,
  RatingChange,
} from './types';

const whitePlayers = alias(players, 'white_players');
const blackPlayers = alias(players, 'black_players');

type GameRow = typeof games.$inferSelect;

interface JoinedGameRow {
  game: GameRow;
  whiteFullName: string;
  blackFullName: string;
}

const toChessGame = ({ game, whiteFullName, blackFullName }: JoinedGameRow): ChessGame => ({
  id: game.id,
  datetime: game.datetime,
  timeControl: game.timeControl,
  url: game.url,
  description: game.description,
  white: { name: game.whitePlayer, fullName: whiteFullName, rating: game.whiteRating },
  black: { name: game.blackPlayer, fullName: blackFullName, rating: game.blackRating },
  result: game.result,
  termination: game.termination,
  ratingChange: { white: game.ratingChangeWhite, black: game.ratingChangeBlack },
  pgn: game.pgn,
});

export const loadGames = async (): Promise<ChessGame[]> => {
  const rows = getDb()
    .select({
      game: games,
      whiteFullName: whitePlayers.fullName,
      blackFullName: blackPlayers.fullName,
    })
    .from(games)
    .innerJoin(whitePlayers, eq(games.whitePlayer, whitePlayers.name))
    .innerJoin(blackPlayers, eq(games.blackPlayer, blackPlayers.name))
    .orderBy(desc(games.datetime))
    .all();

  return rows.map(toChessGame);
};

const ratingFor = (game: GameRow, playerName: string): number | null => {
  if (game.whitePlayer === playerName) {
    return game.whiteRating;
  }
  if (game.blackPlayer === playerName) {
    return game.blackRating;
  }
  return null;
};

export const loadPlayers = async (): Promise<Player[]> => {
  const db = getDb();
  const playerRows = db.select().from(players).all();
  const gameRows = db.select().from(games).orderBy(asc(games.datetime)).all();

  return playerRows.map((player) => ({
    name: player.name,
    fullName: player.fullName,
    rating: player.rating,
    games: gameRows.flatMap((game) => {
      const newRating = ratingFor(game, player.name);
      return newRating === null ? [] : [{ gameId: game.id, newRating }];
    }),
  }));
};

export const getPlayerByName = (playerList: Player[], name: string): Player | null => {
  return playerList.find((player) => player.name === name) ?? null;
};

const scoreFor = (result: GameResult, colour: 'white' | 'black'): number => {
  if (result === '1/2-1/2') {
    return 0.5;
  }
  const winner = result === '1-0' ? 'white' : 'black';
  return winner === colour ? 1 : 0;
};

export const recalculateRatings = async (): Promise<void> => {
  getDb().transaction((tx) => {
    const playerRows = tx.select().from(players).all();
    const gameRows = tx.select().from(games).orderBy(asc(games.datetime)).all();
    const ratings = new Map(playerRows.map((player) => [player.name, startingRating]));

    for (const game of gameRows) {
      const whiteRating = ratings.get(game.whitePlayer);
      const blackRating = ratings.get(game.blackPlayer);

      if (whiteRating === undefined || blackRating === undefined) {
        throw new Error(`Player not found: ${game.whitePlayer} or ${game.blackPlayer}`);
      }

      const newWhite = calculateEloRating(whiteRating, blackRating, scoreFor(game.result, 'white'));
      const newBlack = calculateEloRating(blackRating, whiteRating, scoreFor(game.result, 'black'));

      ratings.set(game.whitePlayer, newWhite);
      ratings.set(game.blackPlayer, newBlack);

      tx.update(games)
        .set({
          whiteRating: newWhite,
          blackRating: newBlack,
          ratingChangeWhite: newWhite - whiteRating,
          ratingChangeBlack: newBlack - blackRating,
        })
        .where(eq(games.id, game.id))
        .run();
    }

    for (const [name, rating] of ratings) {
      tx.update(players).set({ rating }).where(eq(players.name, name)).run();
    }
  });
};

export const saveGame = async (game: Omit<ChessGame, 'id'>): Promise<void> => {
  getDb()
    .insert(games)
    .values({
      id: nanoid(8),
      datetime: game.datetime,
      timeControl: game.timeControl,
      url: game.url,
      description: game.description,
      whitePlayer: game.white.name,
      blackPlayer: game.black.name,
      whiteRating: game.white.rating,
      blackRating: game.black.rating,
      result: game.result,
      termination: game.termination,
      ratingChangeWhite: game.ratingChange.white,
      ratingChangeBlack: game.ratingChange.black,
      pgn: game.pgn,
    })
    .run();

  await recalculateRatings();
};

let ratingsPass: Promise<void> | null = null;

const runRatingsPass = async (): Promise<void> => {
  await recalculateRatings();
  console.log('Player ratings recalculated.');
};

export const ensureRatingsUpToDate = (): Promise<void> => {
  if (ratingsPass === null) {
    ratingsPass = runRatingsPass();
  }
  return ratingsPass;
};
