import { JSX } from "react";
import { ChessGame, GameResult, getTerminationDescription } from "../../../../db.js";
import styles from "./styles.module.css";
import { Button } from "../../../../components/Button/index.js";

interface Props {
  game: ChessGame;
}

const buildResultMessage = (result: GameResult): string => {
  switch (result) {
    case "1-0":
      return "Vyhrál bílý";
    case "0-1":
      return "Vyhrál černý";
    case "1/2-1/2":
      return "Remíza";
    default:
      return "???";
  }
};

export const GameRow = ({ game }: Props): JSX.Element => {
  return (
    <div className={styles.gameRow}>
      <div className={styles.colResult}>
        <div className={styles.gameIcon} />
        <div>
          <div className={styles.playersLine}>
            <span className={styles.whitePiece}>♔</span>
            <span className={styles.playerName}>{game.white.name}</span>
            <span className={styles.playerRating}>({game.white.rating})</span>
            {game.ratingChange.white > 0 ? (
              <span>+{game.ratingChange.white}</span>
            ) : game.ratingChange.white < 0 ? (
              <span>{game.ratingChange.white}</span>
            ) : null}

            <span className={styles.vs}>vs</span>
            <span className={styles.blackPiece}>♚</span>
            <span className={styles.playerName}>{game.black.name}</span>
            <span className={styles.playerRating}>({game.black.rating})</span>
            {game.ratingChange.black > 0 ? (
              <span>+{game.ratingChange.black}</span>
            ) : game.ratingChange.black < 0 ? (
              <span>{game.ratingChange.black}</span>
            ) : null}
          </div>
          <div className={styles.resultLine}>
            <span className={styles.result}>{buildResultMessage(game.result)}</span>
            <span className={styles.termination}>({getTerminationDescription(game.termination).name})</span>
            <span>⏱️ {game.timeControl}</span>
          </div>
        </div>
      </div>

      <div className={styles.colDate}>
        <p className={styles.gameDate}>{game.datetime.split('T')[0]}</p>
        <p className={styles.gameTime}>{game.datetime.split('T')[1]}</p>
      </div>

      <div className={styles.colDescription}>
        {game.description === null || game.description.trim() === "" ? (
          <em className={styles.noDescription}>Bez popisu</em>
        ) : (
          game.description
        )}
      </div>

      <div className={styles.colActions}>
        {game.url && (
          <Button href={game.url} variant="outline" target="_blank">Lichess</Button>
        )}
      </div>
    </div>
  );
};
