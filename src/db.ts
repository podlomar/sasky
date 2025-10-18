import fs from 'node:fs/promises';
import path from 'node:path';

export interface Player {
  name: string;
  rating: number;
}

export interface RatingChange {
  white: number;
  black: number;
}

export interface ChessGame {
  id: number;
  date: string;
  url: string;
  description: string;
  white: Player;
  black: Player;
  result: string;
  ratingChange: RatingChange;
  pgn: string;
}

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
