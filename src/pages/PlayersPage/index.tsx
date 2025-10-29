import { JSX } from "react";
import { Layout } from "../../components/Layout/index.js";
import { Container } from "../../components/Container/index.js";
import { PageHeader } from "../../components/PageHeader/index.js";
import { Panel } from "../../components/Panel/index.js";
import { Player } from "../../db.js";
import styles from "./styles.module.css";

interface Props {
  players: Player[];
}

export const PlayersPage = ({ players }: Props): JSX.Element => {
  return (
    <Layout title="Šášky | Hráči">
      <Container>
        <PageHeader
          title="Hráči"
          subtitle="ELO hodnocení a statistiky"
        />

        <div className={styles.players}>
          {players.map((player) => (
            <div className={styles.playerCard} key={player.name}>
              <div className={styles.playerHeader}>
                <h2 className={styles.playerName}>{player.name}</h2>
                <div className={styles.currentRating}>
                  <span className={styles.ratingLabel}>Aktuální hodnocení</span>
                  <span className={styles.ratingValue}>{player.rating}</span>
                </div>
              </div>

              <div className={styles.playerStats}>
                <Panel className={styles.statItem}>
                  <span className={styles.statLabel}>Počet her</span>
                  <span className={styles.statValue}>{player.games.length}</span>
                </Panel>
                <Panel className={styles.statItem}>
                  <span className={styles.statLabel}>Změna hodnocení</span>
                  <span className={`${styles.statValue} ${player.rating >= 800 ? styles.positive : styles.negative}`}>
                    {player.rating >= 800 ? '+' : ''}{player.rating - 800}
                  </span>
                </Panel>
              </div>

              <div className={styles.chartContainer}>
                <canvas
                  id={`chart-${player.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={styles.ratingChart}
                  width="400"
                  height="200"
                ></canvas>
              </div>
            </div>
          ))}
        </div>

        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const players = ${JSON.stringify(players)};
              
              players.forEach(player => {
                const chartId = 'chart-' + player.name.toLowerCase().replace(/\\s+/g, '-');
                const ctx = document.getElementById(chartId);
                
                if (!ctx) return;
                
                // Prepare data for the chart
                const gameLabels = player.games.map((game, index) => 'Game ' + (index + 1));
                let ratingData = [800, ...player.games.map(game => game.newRating)];
                let labels = ['Start', ...gameLabels];
                
                // If there's only one data point (just the start), add a dummy point to show a horizontal line
                if (ratingData.length === 1) {
                  ratingData.push(800);
                  labels.push('');
                }
                
                new Chart(ctx, {
                  type: 'line',
                  data: {
                    labels: labels,
                    datasets: [{
                      label: 'ELO Rating',
                      data: ratingData,
                      borderColor: '#58a6ff',
                      backgroundColor: 'rgba(88, 166, 255, 0.1)',
                      borderWidth: 2,
                      fill: true,
                      tension: 0.2,
                      pointRadius: 0,
                      pointHoverRadius: 0
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                    },
                    scales: {
                      x: { display: false },
                      y: {
                        grid: {
                          color: '#30363d'
                        },
                        ticks: {
                          color: '#8b949e'
                        },
                        beginAtZero: false
                      }
                    }
                  }
                });
              });
            });
          `
        }} />
      </Container>
    </Layout>
  );
};
