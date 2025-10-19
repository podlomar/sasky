import fs from 'node:fs/promises';
import path from 'node:path';
import { nanoid } from 'nanoid';
import { calculateEloRating } from './elo.js';

export interface GameRating {
  gameId: string;
  newRating: number;
}

export interface Player {
  name: string;
  rating: number;
  games: GameRating[];
}

export interface RatingChange {
  white: number;
  black: number;
}

export interface ChessGame {
  id: string;
  date: string;
  time: string;
  url: string | null;
  description: string | null;
  white: Player;
  black: Player;
  result: string;
  endingType: string;
  ratingChange: RatingChange;
  pgn: string | null;
}

export const saveGames = async (games: ChessGame[]): Promise<void> => {
  try {
    const gamesFilePath = path.join('..', 'data', 'games.json');
    await fs.writeFile(gamesFilePath, JSON.stringify(games, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving games:', error);
    throw new Error('Failed to save games to data/games.json');
  }
};

export const savePlayers = async (players: Player[]): Promise<void> => {
  try {
    const playersFilePath = path.join('..', 'data', 'players.json');
    await fs.writeFile(playersFilePath, JSON.stringify(players, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving players:', error);
    throw new Error('Failed to save players to data/players.json');
  }
};

const compareByDateAndTime = (a: ChessGame, b: ChessGame): number => {
  const dateA = new Date(`${a.date}T${a.time}`);
  const dateB = new Date(`${b.date}T${b.time}`);
  return dateB.getTime() - dateA.getTime();
};

const sortGamesByDateAndTime = (games: ChessGame[]): ChessGame[] => {
  return games.sort(compareByDateAndTime);
};

const getPlayerByName = (players: Player[], name: string): Player | null => {
  const player = players.find(player => player.name === name);
  return player ?? null;
};

export const recalculateRatings = async (
  games: ChessGame[], players: Player[]
): Promise<void> => {
  sortGamesByDateAndTime(games);

  for (const player of players) {
    player.rating = 800;
    player.games = [];
  }

  for (const game of games.toReversed()) {
    const whitePlayer = getPlayerByName(players, game.white.name);
    const blackPlayer = getPlayerByName(players, game.black.name);

    if (whitePlayer === null || blackPlayer === null) {
      throw new Error(`Player not found: ${game.white.name} or ${game.black.name}`);
    }

    const scoreWhite = game.result === '1-0'
      ? 1
      : game.result === '0-1' ? 0 : 0.5;
    const scoreBlack = game.result === '0-1'
      ? 1
      : game.result === '1-0' ? 0 : 0.5;

    const newWhiteRating = calculateEloRating(
      whitePlayer.rating,
      blackPlayer.rating,
      scoreWhite
    );
    const newBlackRating = calculateEloRating(
      blackPlayer.rating,
      whitePlayer.rating,
      scoreBlack
    );

    game.ratingChange.white = newWhiteRating - whitePlayer.rating;
    game.ratingChange.black = newBlackRating - blackPlayer.rating;

    whitePlayer.rating = newWhiteRating;
    blackPlayer.rating = newBlackRating;

    game.white.rating = newWhiteRating;
    game.black.rating = newBlackRating;

    whitePlayer.games.push({ gameId: game.id, newRating: newWhiteRating });
    blackPlayer.games.push({ gameId: game.id, newRating: newBlackRating });
  }

  await saveGames(games);
  await savePlayers(players);
};

export const loadGames = async (): Promise<ChessGame[]> => {
  try {
    const gamesFilePath = path.join('..', 'data', 'games.json');
    const gamesData = await fs.readFile(gamesFilePath, 'utf-8');
    const games: ChessGame[] = JSON.parse(gamesData);
    return games;
  } catch (error) {
    console.error('Error loading games:', error);
    throw new Error('Failed to load games from data/games.json');
  }
}

export const loadGamesByPlayer = async (playerName: string): Promise<ChessGame[]> => {
  const games = await loadGames();
  return games.filter(game =>
    game.white.name.toLowerCase() === playerName.toLowerCase() ||
    game.black.name.toLowerCase() === playerName.toLowerCase()
  );
};

export const loadPlayers = async (): Promise<Player[]> => {
  try {
    const playersFilePath = path.join('..', 'data', 'players.json');
    const playersData = await fs.readFile(playersFilePath, 'utf-8');
    const players: Player[] = JSON.parse(playersData);
    return players;
  } catch (error) {
    console.error('Error loading players:', error);
    throw new Error('Failed to load players from data/players.json');
  }
};

export const saveGame = async (game: Omit<ChessGame, 'id'>): Promise<ChessGame> => {
  try {
    const games = await loadGames();
    const players = await loadPlayers();

    const newId = nanoid(8);
    const newGame: ChessGame = { id: newId, ...game };

    games.push(newGame);

    await recalculateRatings(games, players);

    return newGame;
  } catch (error) {
    console.error('Error saving game:', error);
    throw new Error('Failed to save game to data/games.json');
  }
};
