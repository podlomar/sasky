import { JSX } from "react";
import { ChessGame } from "../../db.js";
import { Layout } from "../../components/Layout/index.js";
import { PageHeader } from "../../components/PageHeader/index.js";
import { GameRow } from "./components/GameRow/index.js";
import styles from "./styles.module.css";

interface Props {
  totalGames: number;
  games: ChessGame[];
}

export const HomePage = ({ totalGames, games }: Props): JSX.Element => {
  return (
    <Layout title="Šášky">
      <div className="container">
        <PageHeader title="Šášky" subtitle={`Celkem her: ${totalGames}`} />

        <div className={styles.gamesTable}>
          <div className={styles.gamesHeader}>
            <div className="col-players">Hráči</div>
            <div className="col-result">Výsledek</div>
            <div className="col-date">Datum</div>
            <div className="col-description">Popis</div>
            <div className="col-actions">Akce</div>
          </div>

          {games.map((game) => <GameRow game={game} key={game.id} />)}
        </div>

        {games.length === 0 && (
          <div className={styles.emptyState}>
            <h2>Nenalezeny žádné hry</h2>
            <p>Žádné šachové hry k zobrazení.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
