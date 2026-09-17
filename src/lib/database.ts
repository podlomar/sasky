import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';

export type Db = BetterSQLite3Database<typeof schema>;

const dataDir = process.env.SASKY_DATA_DIR ?? 'data';
const databasePath = process.env.SASKY_DB_PATH ?? path.join(dataDir, 'sasky.db');
const migrationsFolder = process.env.SASKY_MIGRATIONS_DIR ?? 'drizzle';

let connection: Db | null = null;

export const getDb = (): Db => {
  if (connection !== null) {
    return connection;
  }

  const sqlite = new Database(databasePath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  connection = drizzle(sqlite, { schema });
  migrate(connection, { migrationsFolder });
  return connection;
};
