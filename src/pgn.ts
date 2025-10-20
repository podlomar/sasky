export const processPgn = (pgn: string): string => {
  // Remove tags
  pgn = pgn.replace(/\[[^\]]*\]/g, '').trim();

  // Remove extra whitespace
  pgn = pgn.replace(/\s+/g, ' ').trim();

  // Remove comments
  pgn = pgn.replace(/;[^\n]*/g, '').trim();

  // Remove variations
  pgn = pgn.replace(/\{[^\}]*\}/g, '').trim();

  return pgn.trim();
};

interface Turn {
  turnNumber: number;
  whiteMove: string;
  blackMove?: string;
}

const readTurnNumber = (input: string, index: number): { turn: number; newIndex: number } | null => {
  const turnRegex = /\s*(\d+)\.\s*/y;
  turnRegex.lastIndex = index;
  const match = turnRegex.exec(input);
  if (match) {
    return { turn: parseInt(match[1], 10), newIndex: turnRegex.lastIndex };
  }
  return null;
};

const readMove = (input: string, index: number): { move: string; newIndex: number } | null => {
  const moveRegex = /\s*([PNBRQK]?[a-h]?[1-8]?x?[a-h][1-8](=[NBRQK])?|O-O(-O)?)\s*/y;
  moveRegex.lastIndex = index;
  const match = moveRegex.exec(input);
  if (match) {
    return { move: match[1], newIndex: moveRegex.lastIndex };
  }
  return null;
};

const readTurn = (input: string, index: number): { turn: Turn; newIndex: number } | null => {
  const turnNumberResult = readTurnNumber(input, index);
  if (!turnNumberResult) {
    return null;
  }
  let { turn: turnNumber, newIndex } = turnNumberResult;

  const whiteMoveResult = readMove(input, newIndex);
  if (!whiteMoveResult) {
    return null;
  }
  const whiteMove = whiteMoveResult.move;
  newIndex = whiteMoveResult.newIndex;

  const blackMoveResult = readMove(input, newIndex);
  let blackMove: string | undefined = undefined;
  if (blackMoveResult) {
    blackMove = blackMoveResult.move;
    newIndex = blackMoveResult.newIndex;
  }

  return {
    turn: { turnNumber, whiteMove, blackMove },
    newIndex,
  };
};

export const parsePgnToTurns = (pgn: string): Turn[] => {
  const turns: Turn[] = [];
  let index = 0;

  while (index < pgn.length) {
    const turnResult = readTurn(pgn, index);
    if (!turnResult) {
      break;
    }
    turns.push(turnResult.turn);
    index = turnResult.newIndex;
  }

  return turns;
};
