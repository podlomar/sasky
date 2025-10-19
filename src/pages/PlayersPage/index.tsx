import { JSX } from "react";
import { Layout } from "../../components/Layout";
import { Player } from "../../db.js";

interface Props {
  players: Player[];
}

export const PlayersPage = ({ players }: Props): JSX.Element => {
  return (
    <Layout title="Šášky | Hráči">
      <div className="container">
        <header className="page-header">
          <h1>Hráči</h1>
          <p className="subtitle">ELO hodnocení a statistiky</p>
        </header>

        <div className="players-grid">
          {players.map((player) => (
            <div className="player-card" key={player.name}>
              <div className="player-header">
                <h2 className="player-name">{player.name}</h2>
                <div className="current-rating">
                  <span className="rating-label">Aktuální hodnocení</span>
                  <span className="rating-value">{player.rating}</span>
                </div>
              </div>

              <div className="player-stats">
                <div className="stat-item">
                  <span className="stat-label">Počet her</span>
                  <span className="stat-value">{player.games.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Změna hodnocení</span>
                  <span className={`stat-value ${player.rating >= 800 ? 'positive' : 'negative'}`}>
                    {player.rating >= 800 ? '+' : ''}{player.rating - 800}
                  </span>
                </div>
              </div>

              <div className="chart-container">
                <canvas
                  id={`chart-${player.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="rating-chart"
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
                const ratingData = [800, ...player.games.map(game => game.newRating)];
                
                new Chart(ctx, {
                  type: 'line',
                  data: {
                    labels: ['Start', ...gameLabels],
                    datasets: [{
                      label: 'ELO Rating',
                      data: ratingData,
                      borderColor: '#58a6ff',
                      backgroundColor: 'rgba(88, 166, 255, 0.1)',
                      borderWidth: 2,
                      fill: true,
                      tension: 0.2,
                      pointBackgroundColor: '#58a6ff',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                      pointRadius: 4,
                      pointHoverRadius: 6
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        backgroundColor: 'rgba(13, 17, 23, 0.9)',
                        titleColor: '#f0f6fc',
                        bodyColor: '#f0f6fc',
                        borderColor: '#30363d',
                        borderWidth: 1
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          color: '#30363d'
                        },
                        ticks: {
                          color: '#8b949e'
                        }
                      },
                      y: {
                        grid: {
                          color: '#30363d'
                        },
                        ticks: {
                          color: '#8b949e'
                        },
                        beginAtZero: false
                      }
                    },
                    interaction: {
                      intersect: false,
                      mode: 'index'
                    }
                  }
                });
              });
            });
          `
        }} />
      </div>
    </Layout>
  );
};
