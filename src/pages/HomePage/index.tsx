import { JSX } from "react";
import { Layout } from "../../components/Layout";
import { ChessGame } from "../../db.js";
import { GameRow } from "../GameRow";

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

          {games.map((game) => <GameRow game={game} key={game.id} />)}
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
