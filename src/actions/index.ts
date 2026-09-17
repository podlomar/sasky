import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { gameResults, getPlayerByName, loadPlayers, saveGame, type ChessGame } from '../lib/db';
import { terminationKeys } from '../lib/terminations';
import { postOnLichess, purifyPgn } from '../lib/pgn';

const gameFormSchema = z.object({
  datetime: z.string(),
  timeControl: z.string(),
  description: z.string().nullable(),
  whitePlayer: z.string(),
  blackPlayer: z.string(),
  result: z.enum(gameResults),
  termination: z.enum(terminationKeys),
  pgn: z.string().nullable(),
});

export type GameFormValues = z.infer<typeof gameFormSchema>;

export type RejectionReason = 'samePlayer' | 'invalidPgn';

export type AddGameResult =
  | { status: 'created' }
  | { status: 'rejected'; reason: RejectionReason; values: GameFormValues };

export const server = {
  addGame: defineAction({
    accept: 'form',
    input: gameFormSchema,
    handler: async (input): Promise<AddGameResult> => {
      if (input.whitePlayer === input.blackPlayer) {
        return { status: 'rejected', reason: 'samePlayer', values: input };
      }

      const players = await loadPlayers();
      const white = getPlayerByName(players, input.whitePlayer);
      const black = getPlayerByName(players, input.blackPlayer);

      if (white === null || black === null) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: `Player not found: ${input.whitePlayer} or ${input.blackPlayer}`,
        });
      }

      const submittedPgn = input.pgn?.trim() ?? '';
      const purified = submittedPgn === '' ? null : purifyPgn(submittedPgn);

      if (purified !== null && purified.isFail()) {
        return { status: 'rejected', reason: 'invalidPgn', values: input };
      }

      const draft: Omit<ChessGame, 'id' | 'url'> = {
        datetime: input.datetime,
        timeControl: input.timeControl,
        description: input.description,
        white: { name: white.name, fullName: white.fullName, rating: white.rating },
        black: { name: black.name, fullName: black.fullName, rating: black.rating },
        result: input.result,
        termination: input.termination,
        ratingChange: { white: 0, black: 0 },
        pgn: purified === null ? null : purified.get(),
      };

      const url = await postOnLichess(draft);
      await saveGame({ ...draft, url });
      return { status: 'created' };
    },
  }),
};
