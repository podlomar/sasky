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

        <div className="games-grid">
          {games.map((game) => (
            <div className="game-card" key={game.id}>
              <div className="game-header">
                <h3 className="game-title">{game.black.name} vs {game.white.name}</h3>
                <span className="game-date">{game.date}</span>
              </div>

              <div className="players">
                <div className="player white-player">
                  <span className="player-color">♔</span>
                  <a href={`/player/${game.white.name}`} className="player-name">{game.white.name}</a>
                  <span className="player-rating">({game.white.rating})</span>
                  {game.ratingChange.white > 0 ? (
                    <span className="rating-change positive">+{game.ratingChange.white}</span>
                  ) : game.ratingChange.white < 0 ? (
                    <span className="rating-change negative">{game.ratingChange.white}</span>
                  ) : null}
                </div>

                <div className="vs">VS</div>

                <div className="player black-player">
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

              <div className="game-result">
                <span className="result-badge result-{game.result.replace('-', '')}">{game.result}</span>
              </div>

              <p className="game-description">{game.description}</p>

              <div className="game-actions">
                <a href={game.url} target="_blank" className="btn btn-secondary">View on Lichess</a>
                <a href={`/game/${game.id}`} className="btn btn-primary">View Details</a>
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
