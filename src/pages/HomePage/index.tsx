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
    <Layout title="Šášky">
      <div className="container">
        <header className="page-header">
          <h1>Šášky</h1>
          <p className="subtitle">Celkem her: {totalGames}</p>
        </header>

        <div className="games-table">
          <div className="games-header">
            <div className="col-players">Hráči</div>
            <div className="col-result">Výsledek</div>
            <div className="col-date">Datum</div>
            <div className="col-description">Popis</div>
            <div className="col-actions">Akce</div>
          </div>

          {games.map((game) => <GameRow game={game} key={game.id} />)}
        </div>

        {games.length === 0 && (
          <div className="empty-state">
            <h2>Nenalezeny žádné hry</h2>
            <p>Žádné šachové hry k zobrazení.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
