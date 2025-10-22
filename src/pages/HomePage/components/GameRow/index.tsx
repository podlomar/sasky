import { JSX } from "react";
import { ChessGame, getTerminationDescription } from "../../../../db.js";

interface Props {
  game: ChessGame;
}

export const GameRow = ({ game }: Props): JSX.Element => {
  return (
    <div className="game-row">
      <div className="col-players">
        <div className="players-inline">
          <div className="player-inline white-player">
            <span className="player-color">♔</span>
            <span className="player-name">{game.white.name}</span>
            <span className="player-rating">({game.white.rating})</span>
            {game.ratingChange.white > 0 ? (
              <span>+{game.ratingChange.white}</span>
            ) : game.ratingChange.white < 0 ? (
              <span>{game.ratingChange.white}</span>
            ) : null}
          </div>
          <span className="vs-inline">vs</span>
          <div className="player-inline black-player">
            <span className="player-color">♚</span>
            <span className="player-name">{game.black.name}</span>
            <span className="player-rating">({game.black.rating})</span>
            {game.ratingChange.black > 0 ? (
              <span className="rating-change positive">+{game.ratingChange.black}</span>
            ) : game.ratingChange.black < 0 ? (
              <span className="rating-change negative">{game.ratingChange.black}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="col-result">
        <div className="game-timecontrol">{game.timeControl}</div>
        <span className={`result-badge result-${game.result.replace(/-\//, '')}`}>
          {game.result}
        </span>
        <div className="ending-type">
          Zakončení: {getTerminationDescription(game.termination).name}
        </div>
      </div>

      <div className="col-date">
        <div className="game-datetime">
          <span className="game-date">{game.datetime.split('T')[0]}</span>
          <span className="game-time">{game.datetime.split('T')[1]}</span>
        </div>
      </div>

      <div className="col-description">
        <span className="game-description-inline">
          {game.description || <em className="no-description">Bez popisu</em>}
        </span>
      </div>

      <div className="col-actions">
        <div className="game-actions-inline">
          {game.url && (
            <a href={game.url} target="_blank" className="btn btn-secondary btn-sm">Lichess</a>
          )}
        </div>
      </div>
    </div>
  );
};
