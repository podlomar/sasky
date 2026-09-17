import { Result } from 'monadix/result';
import { z } from 'astro/zod';
import { parseGame } from '@mliebelt/pgn-parser';
import type { ChessGame } from './db';
import { getTerminationDescription } from './terminations';

export const purifyPgn = (pgn: string): Result<string, string> => {
  try {
    const tree = parseGame(pgn);

    let result = '';
    let moveNumber = 0;
    for (const move of tree.moves) {
      if (move.moveNumber !== null && move.moveNumber > moveNumber) {
        moveNumber = move.moveNumber;
        result += `${moveNumber}. `;
      }
      result += `${move.notation.notation} `;
    }

    return Result.success(result.trim());
  } catch {
    return Result.fail('Invalid PGN format');
  }
};

const buildLichessPgn = (game: Omit<ChessGame, 'id' | 'url'>, pgn: string): string => {
  const date = new Date(game.datetime);
  const pad = (value: number): string => String(value).padStart(2, '0');
  const formattedDate = `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
  const formattedTime = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const standardTermination =
    getTerminationDescription(game.termination).standard ?? game.termination;

  return [
    '[Event "Newton Chess Club Casual OTB"]',
    '[Site "Newton Technologies"]',
    `[Date "${formattedDate}"]`,
    `[Time "${formattedTime}"]`,
    `[White "${game.white.fullName}"]`,
    `[Black "${game.black.fullName}"]`,
    `[WhiteElo "${game.white.rating}"]`,
    `[BlackElo "${game.black.rating}"]`,
    `[TimeControl "${game.timeControl}"]`,
    `[Result "${game.result}"]`,
    `[Termination "${standardTermination}"]`,
    '[Mode "OTB"]',
    '',
    pgn,
  ].join('\n');
};

export const postOnLichess = async (
  game: Omit<ChessGame, 'id' | 'url'>,
): Promise<string | null> => {
  if (game.pgn === null || game.pgn.trim() === '') {
    return null;
  }

  const response = await fetch('https://lichess.org/api/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({ pgn: buildLichessPgn(game, game.pgn) }),
  });

  if (!response.ok) {
    throw new Error(`Failed to post PGN to Lichess: ${response.statusText}`);
  }

  const data = z.object({ url: z.string() }).parse(await response.json());
  return data.url;
};
