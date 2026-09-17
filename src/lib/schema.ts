import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { terminationKeys } from './terminations';
import { gameResults } from './types';

export const players = sqliteTable('players', {
  name: text('name').primaryKey(),
  fullName: text('full_name').notNull(),
  rating: integer('rating').notNull(),
});

export const games = sqliteTable('games', {
  id: text('id').primaryKey(),
  datetime: text('datetime').notNull(),
  timeControl: text('time_control').notNull(),
  url: text('url'),
  description: text('description'),
  whitePlayer: text('white_player').notNull().references(() => players.name),
  blackPlayer: text('black_player').notNull().references(() => players.name),
  whiteRating: integer('white_rating').notNull(),
  blackRating: integer('black_rating').notNull(),
  result: text('result', { enum: gameResults }).notNull(),
  termination: text('termination', { enum: terminationKeys }).notNull(),
  ratingChangeWhite: integer('rating_change_white').notNull(),
  ratingChangeBlack: integer('rating_change_black').notNull(),
  pgn: text('pgn'),
}, (table) => [
  index('games_datetime_idx').on(table.datetime),
]);
