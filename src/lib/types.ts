import type { Termination } from './terminations';

export const gameResults = ['1-0', '0-1', '1/2-1/2'] as const;

export type GameResult = (typeof gameResults)[number];

export const startingRating = 800;

export interface GamePlayer {
  name: string;
  fullName: string;
  rating: number;
}

export interface GameRating {
  gameId: string;
  newRating: number;
}

export interface Player extends GamePlayer {
  games: GameRating[];
}

export interface RatingChange {
  white: number;
  black: number;
}

export interface ChessGame {
  id: string;
  datetime: string;
  timeControl: string;
  url: string | null;
  description: string | null;
  white: GamePlayer;
  black: GamePlayer;
  result: GameResult;
  termination: Termination;
  ratingChange: RatingChange;
  pgn: string | null;
}
