import { JSX } from "react";
import { Layout } from "../../components/Layout";
import { ChessGame } from "../../db.js";

interface Props {
  totalGames: number;
  games: ChessGame[];
}

export const HomePage = ({ totalGames, games }: Props): JSX.Element => {
  return (
    <Layout title="Home Page">
      <div className="container">
        <header className="page-header">
          <h1>Chess Games</h1>
          <p className="subtitle">Total games: {totalGames}</p>
        </header>

        <div className="games-table">
          <div className="games-header">
            <div className="col-players">Players</div>
            <div className="col-result">Result</div>
            <div className="col-date">Date</div>
            <div className="col-description">Description</div>
            <div className="col-actions">Actions</div>
          </div>

          {games.map((game) => (
            <div className="game-row" key={game.id}>
              <div className="col-players">
                <div className="players-inline">
                  <div className="player-inline white-player">
                    <span className="player-color">♔</span>
                    <a href={`/player/${game.white.name}`} className="player-name">{game.white.name}</a>
                    <span className="player-rating">({game.white.rating})</span>
                    {game.ratingChange.white > 0 ? (
                      <span className="rating-change positive">+{game.ratingChange.white}</span>
                    ) : game.ratingChange.white < 0 ? (
                      <span className="rating-change negative">{game.ratingChange.white}</span>
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
                <span className="game-date">{game.date}</span>
              </div>

              <div className="col-description">
                <span className="game-description-inline">{game.description}</span>
              </div>

              <div className="col-actions">
                <div className="game-actions-inline">
                  <a href={game.url} target="_blank" className="btn btn-secondary btn-sm">Lichess</a>
                  <a href={`/game/${game.id}`} className="btn btn-primary btn-sm">Details</a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {games.length === 0 && (
          <div className="empty-state">
            <h2>No games found</h2>
            <p>There are no chess games to display.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
