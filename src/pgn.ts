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
