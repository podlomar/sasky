import { JSX } from "react";
import clsx from "clsx";
import { Layout } from "../../components/Layout/index.js";
import { Container } from "../../components/Container/index.js";
import { PageHeader } from "../../components/PageHeader/index.js";
import { Button } from "../../components/Button/index.js";
import { getTerminationOptions, Player } from "../../db.js";
import styles from "./styles.module.css";
import { Panel } from "../../components/Panel/index.js";

interface FormValues {
  datetime: string;
  timeControl: string;
  description: string;
  whitePlayer: string;
  blackPlayer: string;
  result: string;
  termination: string;
  pgn: string;
}

interface Props {
  players: Player[];
  values?: Partial<FormValues>;
}

export const EnterGamePage = ({ players, values = {} }: Props): JSX.Element => {
  const terminationOptions = getTerminationOptions();
  const nowDate = new Date().toISOString().slice(0, 16);

  return (
    <Layout title="Šášky | Zadat novou hru">
      <Container width="narrow">
        <PageHeader
          title="Zadat novou hru"
          subtitle="Přidat novou šachovou hru do databáze"
        />

        <form action="/enter" method="POST" className={styles.gameForm}>
          <div className={styles.formSection}>
            <h2>Informace o hře</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="date">Datum a čas</label>
                <input
                  type="datetime-local"
                  id="datetime"
                  name="datetime"
                  defaultValue={values.datetime ?? nowDate}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="timeControl">Časový limit</label>
                <input
                  type="text"
                  id="timeControl"
                  name="timeControl"
                  defaultValue={values.timeControl ?? "8+10"}
                  placeholder="např. 8+10, 5+0, Free"
                  required
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Popis (volitelné)</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={values.description ?? ""}
                placeholder="Popište, co se v této hře stalo..."
                className={clsx(styles.formInput, styles.formTextarea)}
              ></textarea>
            </div>
          </div>
          <div className={styles.formSection}>
            <h2>Hráči</h2>

            <div className={styles.playersSection}>
              <Panel className={clsx(styles.playerGroup, styles.whitePlayerGroup)}>
                <h3>
                  <span className={styles.playerColorLarge}>♔</span>
                  Bílý hráč
                </h3>
                <div className={styles.formGroup}>
                  <label htmlFor="whitePlayer">Hráč</label>
                  <select id="whitePlayer" name="whitePlayer" required className={styles.formSelect}>
                    <option value="">Vyberte bílého hráče</option>
                    {players.map((player) => (
                      <option
                        key={player.name}
                        value={player.name}
                        selected={player.name === values.whitePlayer}
                      >
                        {player.name}
                      </option>
                    ))}
                  </select>
                </div>
              </Panel>

              <div className={styles.vsSeparator}>VS</div>

              <Panel className={clsx(styles.playerGroup, styles.blackPlayerGroup)}>
                <h3>
                  <span className={styles.playerColorLarge}>♚</span>
                  Černý hráč
                </h3>
                <div className={styles.formGroup}>
                  <label htmlFor="blackPlayer">Hráč</label>
                  <select id="blackPlayer" name="blackPlayer" required className={styles.formSelect}>
                    <option value="">Vyberte černého hráče</option>
                    {players.map((player) => (
                      <option
                        key={player.name}
                        value={player.name}
                        selected={player.name === values.blackPlayer}
                      >
                        {player.name}
                      </option>
                    ))}
                  </select>
                </div>
              </Panel>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="result">Výsledek hry</label>
                <select id="result" name="result" required className={styles.formSelect}>
                  <option value="">Vyberte výsledek</option>
                  <option value="1-0" selected={values.result === "1-0"}>1-0 (Bílý vyhrává)</option>
                  <option value="0-1" selected={values.result === "0-1"}>0-1 (Černý vyhrává)</option>
                  <option value="1/2-1/2" selected={values.result === "1/2-1/2"}>1/2-1/2 (Remíza)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="termination">Jak hra skončila</label>
                <select id="termination" name="termination" required className={styles.formSelect}>
                  <option value="">Vyberte typ ukončení</option>
                  {terminationOptions.map((option) => (
                    <option key={option.value} value={option.value} selected={option.value === values.termination}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>PGN Notace (volitelné)</h2>
            <div className={styles.formGroup}>
              <label htmlFor="pgn">Herní notace</label>
              <textarea
                id="pgn"
                name="pgn"
                defaultValue={values.pgn ?? ""}
                rows={8}
                placeholder="Vložte PGN notaci hry..."
                className={clsx(styles.formInput, styles.formTextarea, styles.pgnTextarea)}
              ></textarea>
              <div className={styles.formHelp}>
                Pokud máte PGN záznam hry, vložte ji zde pro vytvoření přesného záznamu hry na Lichess.
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <Button href="/" variant="secondary">Zrušit</Button>
            <Button type="submit" variant="primary">Přidat hru</Button>
          </div>
        </form>
      </Container>
    </Layout>
  );
};
