export const calculateEloRating = (
  playerRating: number,
  opponentRating: number,
  score: number,
  kFactor: number = 32,
): number => {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  return Math.round(playerRating + kFactor * (score - expectedScore));
};
