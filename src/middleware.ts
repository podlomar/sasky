import { defineMiddleware } from 'astro:middleware';
import { ensureRatingsUpToDate } from './lib/db';

export const onRequest = defineMiddleware(async (_context, next) => {
  await ensureRatingsUpToDate();
  return next();
});
