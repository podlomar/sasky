import { JSX } from "react";
import pkg from '../../../package.json' with { type: 'json' };
import styles from './styles.module.css';

export const Footer = (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Šášky, verze {pkg.version}</p>
      </div>
    </footer>
  );
};
