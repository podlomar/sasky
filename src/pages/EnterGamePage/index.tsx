import { JSX } from "react";
import { Layout } from "../../components/Layout/index.js";
import { PageHeader } from "../../components/PageHeader/index.js";
import { getTerminationOptions, Player } from "../../db.js";

interface Props {
  players: Player[];
}

export const EnterGamePage = ({ players }: Props): JSX.Element => {
  const terminationOptions = getTerminationOptions();

  const nowDate = new Date().toISOString();

  return (
    <Layout title="Šášky | Zadat novou hru">
      <div className="container">
        <PageHeader
          title="Zadat novou hru"
          subtitle="Přidat novou šachovou hru do databáze"
        />

        <div className="enter-game-form">
          <form action="/enter" method="POST" className="game-form">
            <div className="form-section">
              <h2>Informace o hře</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Datum a čas</label>
                  <input
                    type="datetime-local"
                    id="datetime"
                    name="datetime"
                    defaultValue={nowDate}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="timeControl">Časový limit</label>
                  <input
                    type="text"
                    id="timeControl"
                    name="timeControl"
                    defaultValue="8+10"
                    placeholder="např. 8+10, 5+0, Free"
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
                  <label htmlFor="termination">Jak hra skončila</label>
                  <select id="termination" name="termination" required className="form-select">
                    <option value="">Vyberte typ ukončení</option>
                    {terminationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
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
