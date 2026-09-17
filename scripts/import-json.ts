import fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'astro/zod';
import { getDb } from '../src/lib/database';
import { games, players } from '../src/lib/schema';
import { terminationKeys } from '../src/lib/terminations';
import { gameResults } from '../src/lib/types';

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

const dataDir = process.env.SASKY_DATA_DIR ?? 'data';

const readJson = async <T>(fileName: string, schema: z.ZodType<T>): Promise<T> => {
  const raw = await fs.readFile(path.join(dataDir, fileName), 'utf-8');
  return schema.parse(JSON.parse(raw));
};

const playerList = await readJson('players.json', z.array(playerSchema));
const gameList = await readJson('games.json', z.array(chessGameSchema));

const knownPlayers = new Set(playerList.map((player) => player.name));
const orphans = gameList.filter(
  (game) => !knownPlayers.has(game.white.name) || !knownPlayers.has(game.black.name),
);

if (orphans.length > 0) {
  const ids = orphans.map((game) => game.id).join(', ');
  throw new Error(`Games reference players missing from players.json: ${ids}`);
}

getDb().transaction((tx) => {
  tx.delete(games).run();
  tx.delete(players).run();

  tx.insert(players).values(playerList.map((player) => ({
    name: player.name,
    fullName: player.fullName,
    rating: player.rating,
  }))).run();

  if (gameList.length > 0) {
    tx.insert(games).values(gameList.map((game) => ({
      id: game.id,
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
    }))).run();
  }
});

console.log(
  `Imported ${playerList.length} players and ${gameList.length} games from ${dataDir} into SQLite.`,
);
