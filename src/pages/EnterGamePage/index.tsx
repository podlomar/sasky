import { JSX } from "react";
import { Layout } from "../../components/Layout";
import { Player } from "../../db.js";

interface Props {
  players: Player[];
}

export const EnterGamePage = ({ players }: Props): JSX.Element => {
  return (
    <Layout title="Enter New Game">
      <div className="container">
        <header className="page-header">
          <h1>Enter New Game</h1>
          <p className="subtitle">Add a new chess game to the database</p>
        </header>

        <div className="enter-game-form">
          <form action="/enter" method="POST" className="game-form">
            <div className="form-section">
              <h2>Game Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Time</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (optional)</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Describe what happened in this game..."
                  className="form-input form-textarea"
                ></textarea>
              </div>
            </div>            <div className="form-section">
              <h2>Players</h2>

              <div className="players-section">
                <div className="player-selection-simple">
                  <div className="player-group white-player-group">
                    <h3>
                      <span className="player-color-large">♔</span>
                      White Player
                    </h3>
                    <div className="form-group">
                      <label htmlFor="whitePlayer">Player</label>
                      <select id="whitePlayer" name="whitePlayer" required className="form-select">
                        <option value="">Select white player</option>
                        {players.map((player) => (
                          <option key={player.name} value={player.name}>
                            {player.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="vs-separator">VS</div>

                  <div className="player-group black-player-group">
                    <h3>
                      <span className="player-color-large">♚</span>
                      Black Player
                    </h3>
                    <div className="form-group">
                      <label htmlFor="blackPlayer">Player</label>
                      <select id="blackPlayer" name="blackPlayer" required className="form-select">
                        <option value="">Select black player</option>
                        {players.map((player) => (
                          <option key={player.name} value={player.name}>
                            {player.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="result">Game Result</label>
                  <select id="result" name="result" required className="form-select">
                    <option value="">Select result</option>
                    <option value="1-0">1-0 (White wins)</option>
                    <option value="0-1">0-1 (Black wins)</option>
                    <option value="1/2-1/2">1/2-1/2 (Draw)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="endingType">How the game ended</label>
                  <select id="endingType" name="endingType" required className="form-select">
                    <option value="">Select ending type</option>
                    <option value="checkmate">Checkmate</option>
                    <option value="resignation">Resignation</option>
                    <option value="time">Time forfeit</option>
                    <option value="abandonment">Abandonment</option>
                    <option value="stalemate">Stalemate</option>
                    <option value="insufficient-material">Insufficient material</option>
                    <option value="threefold-repetition">Threefold repetition</option>
                    <option value="fifty-move-rule">50-move rule</option>
                    <option value="mutual-agreement">Mutual agreement</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>PGN (optional)</h2>
              <div className="form-group">
                <label htmlFor="pgn">Game Notation</label>
                <textarea
                  id="pgn"
                  name="pgn"
                  rows={8}
                  placeholder="Paste the PGN notation of the game here..."
                  className="form-input form-textarea pgn-textarea"
                ></textarea>
                <div className="form-help">
                  Include the complete PGN with headers and moves. You can copy this from Lichess or other chess platforms.
                </div>
              </div>
            </div>

            <div className="form-actions">
              <a href="/" className="btn btn-secondary">Cancel</a>
              <button type="submit" className="btn btn-primary">Add Game</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
