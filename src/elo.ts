export const calculateEloRating = (
  playerRating: number,
  opponentRating: number,
  score: number, // 1 = win, 0.5 = draw, 0 = loss
  kFactor: number = 32
): number => {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  const newRating = playerRating + kFactor * (score - expectedScore);
  return Math.round(newRating);
};
