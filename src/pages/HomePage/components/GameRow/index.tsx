import { JSX } from "react";
import { ChessGame, getTerminationDescription } from "../../../../db.js";
import styles from "./styles.module.css";
import { Button } from "../../../../components/Button/index.js";

interface Props {
  game: ChessGame;
}

export const GameRow = ({ game }: Props): JSX.Element => {
  return (
    <div className={styles.gameRow}>
      <div className={styles.colPlayers}>
        <div className={styles.playersInline}>
          <div className={styles.whitePlayer}>
            <span className={styles.playerColor}>♔</span>
            <span className={styles.playerName}>{game.white.name}</span>
            <span className={styles.playerRating}>({game.white.rating})</span>
            {game.ratingChange.white > 0 ? (
              <span>+{game.ratingChange.white}</span>
            ) : game.ratingChange.white < 0 ? (
              <span>{game.ratingChange.white}</span>
            ) : null}
          </div>
          <span className={styles.vsInline}>vs</span>
          <div className={styles.blackPlayer}>
            <span className={styles.playerColor}>♚</span>
            <span className={styles.playerName}>{game.black.name}</span>
            <span className={styles.playerRating}>({game.black.rating})</span>
            {game.ratingChange.black > 0 ? (
              <span>+{game.ratingChange.black}</span>
            ) : game.ratingChange.black < 0 ? (
              <span>{game.ratingChange.black}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.colResult}>
        <div className={styles.gameTimeControl}>{game.timeControl}</div>
        <span className={`result-badge result-${game.result.replace(/-\//, '')}`}>
          {game.result}
        </span>
        <div className={styles.termination}>
          Zakončení: {getTerminationDescription(game.termination).name}
        </div>
      </div>

      <div className={styles.colDate}>
        <div className={styles.gameDatetime}>
          <span className={styles.gameDate}>{game.datetime.split('T')[0]}</span>
          <span className={styles.gameTime}>{game.datetime.split('T')[1]}</span>
        </div>
      </div>

      <div className={styles.colDescription}>
        <span className={styles.gameDescriptionInline}>
          {game.description || <em className={styles.noDescription}>Bez popisu</em>}
        </span>
      </div>

      <div className={styles.colActions}>
        <div className={styles.gameActionsInline}>
          {game.url && (
            <Button href={game.url} target="_blank">Lichess</Button>
          )}
        </div>
      </div>
    </div>
  );
};
