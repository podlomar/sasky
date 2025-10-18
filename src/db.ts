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
  endingType: string; // How the game ended (checkmate, time, abandonment, etc.)
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
    const newId = Math.max(...games.map(g => g.id), 0) + 1;
    const newGame: ChessGame = { id: newId, ...game };

    games.push(newGame);

    const gamesFilePath = path.join('..', 'data', 'games.json');
    await fs.writeFile(gamesFilePath, JSON.stringify(games, null, 2), 'utf-8');

    return newGame;
  } catch (error) {
    console.error('Error saving game:', error);
    throw new Error('Failed to save game to data/games.json');
  }
};
