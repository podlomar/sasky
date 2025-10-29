import { Result } from 'monadix/result';
import { parseGame } from '@mliebelt/pgn-parser';
import { ChessGame, getTerminationDescription, Player, Termination } from './db.js';

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
  } catch (error) {
    console.error('Error parsing PGN:', error);
    return Result.fail('Invalid PGN format');
  }
};

export const postOnLichess = async (game: ChessGame): Promise<string | null> => {
  if (game.pgn === null || game.pgn.trim() === '') {
    return null;
  }

  const date = new Date(game.datetime);
  const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const standardTermination = getTerminationDescription(game.termination).standard ?? game.termination;

  let lichessPgn = '[Event "Newton Chess Club Casual OTB"]\n';
  lichessPgn += `[Site "Newton Technologies"]\n`;
  lichessPgn += `[Date "${formattedDate}"]\n`;
  lichessPgn += `[Time "${formattedTime}"]\n`;
  lichessPgn += `[White "${game.white.fullName}"]\n`;
  lichessPgn += `[Black "${game.black.fullName}"]\n`;
  lichessPgn += `[WhiteElo "${game.white.rating}"]\n`;
  lichessPgn += `[BlackElo "${game.black.rating}"]\n`;
  lichessPgn += `[TimeControl "${game.timeControl}"]\n`;
  lichessPgn += `[Result "${game.result}"]\n`;
  lichessPgn += `[Termination "${standardTermination}"]\n`;
  lichessPgn += `[Mode "OTB"]\n\n`;

  lichessPgn += purifyPgn(game.pgn);

  console.log('Posting PGN to Lichess:\n', lichessPgn);

  const response = await fetch('https://lichess.org/api/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({ pgn: lichessPgn }),
  });

  if (!response.ok) {
    throw new Error(`Failed to post PGN to Lichess: ${response.statusText}`);
  }

  const data = await response.json() as any;
  console.log('Lichess response:', data);
  game.url = data.url;
  return data.url;
};
