import path from 'node:path';
import { defineConfig } from 'drizzle-kit';

const dataDir = process.env.SASKY_DATA_DIR ?? 'data';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/lib/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.SASKY_DB_PATH ?? path.join(dataDir, 'sasky.db'),
  },
});
