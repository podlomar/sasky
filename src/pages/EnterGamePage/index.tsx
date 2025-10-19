import { JSX } from "react";
import { Layout } from "../../components/Layout";
import { Player } from "../../db.js";

interface Props {
  players: Player[];
}

export const EnterGamePage = ({ players }: Props): JSX.Element => {
  return (
    <Layout title="Šášky | Zadat novou hru">
      <div className="container">
        <header className="page-header">
          <h1>Zadat novou hru</h1>
          <p className="subtitle">Přidat novou šachovou hru do databáze</p>
        </header>

        <div className="enter-game-form">
          <form action="/enter" method="POST" className="game-form">
            <div className="form-section">
              <h2>Informace o hře</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Datum</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Čas</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="timeControl">Hodiny</label>
                  <input
                    type="text"
                    id="timeControl"
                    name="timeControl"
                    placeholder="např. 10+5, 5+3, Free"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Popis (volitelné)</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Popište, co se v této hře stalo..."
                  className="form-input form-textarea"
                ></textarea>
              </div>
            </div>
            <div className="form-section">
              <h2>Hráči</h2>

              <div className="players-section">
                <div className="player-selection-simple">
                  <div className="player-group white-player-group">
                    <h3>
                      <span className="player-color-large">♔</span>
                      Bílý hráč
                    </h3>
                    <div className="form-group">
                      <label htmlFor="whitePlayer">Hráč</label>
                      <select id="whitePlayer" name="whitePlayer" required className="form-select">
                        <option value="">Vyberte bílého hráče</option>
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
                      Černý hráč
                    </h3>
                    <div className="form-group">
                      <label htmlFor="blackPlayer">Hráč</label>
                      <select id="blackPlayer" name="blackPlayer" required className="form-select">
                        <option value="">Vyberte černého hráče</option>
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
                  <label htmlFor="result">Výsledek hry</label>
                  <select id="result" name="result" required className="form-select">
                    <option value="">Vyberte výsledek</option>
                    <option value="1-0">1-0 (Bílý vyhrává)</option>
                    <option value="0-1">0-1 (Černý vyhrává)</option>
                    <option value="1/2-1/2">1/2-1/2 (Remíza)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="endingType">Jak hra skončila</label>
                  <select id="endingType" name="endingType" required className="form-select">
                    <option value="">Vyberte typ konce</option>
                    <option value="checkmate">Mat</option>
                    <option value="resignation">Rezignace</option>
                    <option value="stalemate">Pat</option>
                    <option value="time-forfeit">Vypršení času</option>
                    <option value="abandonment">Opuštění partie</option>
                    <option value="insufficient-material">Nedostatek materiálu</option>
                    <option value="threefold-repetition">Trojí opakování</option>
                    <option value="50-move-rule">Pravidlo 50 tahů</option>
                    <option value="mutual-agreement">Vzájemná dohoda</option>
                    <option value="unknown">Neznámý</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>PGN Notace (volitelné)</h2>
              <div className="form-group">
                <label htmlFor="pgn">Herní notace</label>
                <textarea
                  id="pgn"
                  name="pgn"
                  rows={8}
                  placeholder="Vložte PGN notaci hry..."
                  className="form-input form-textarea pgn-textarea"
                ></textarea>
                <div className="form-help">
                  Pokud máte PGN záznam hry, vložte ji zde pro vytvoření přesného záznamu hry na Lichess.
                </div>
              </div>
            </div>

            <div className="form-actions">
              <a href="/" className="btn btn-secondary">Zrušit</a>
              <button type="submit" className="btn btn-primary">Přidat hru</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
