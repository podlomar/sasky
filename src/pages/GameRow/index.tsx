import { JSX } from "react";
import { ChessGame } from "../../db.js";

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
            <a href={`/player/${game.white.name}`} className="player-name">{game.white.name}</a>
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
            <a href={`/player/${game.black.name}`} className="player-name">{game.black.name}</a>
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
        <span className={`result-badge result-${game.result.replace('-', '')}`} title={`Ended by ${game.endingType}`}>
          {game.result}
        </span>
        <div className="ending-type">{game.endingType}</div>
      </div>

      <div className="col-date">
        <div className="game-datetime">
          <span className="game-date">{game.date}</span>
          <span className="game-time">{game.time}</span>
        </div>
      </div>

      <div className="col-description">
        <span className="game-description-inline">
          {game.description || <em className="no-description">No description</em>}
        </span>
      </div>

      <div className="col-actions">
        <div className="game-actions-inline">
          {game.url && (
            <a href={game.url} target="_blank" className="btn btn-secondary btn-sm">Lichess</a>
          )}
          <a href={`/game/${game.id}`} className="btn btn-primary btn-sm">Details</a>
        </div>
      </div>
    </div>
  );
};
