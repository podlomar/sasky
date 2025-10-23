import { JSX } from "react";
import pkg from '../../../package.json' with { type: 'json' };
import { Container } from "../Container/index.js";
import styles from './styles.module.css';

export const Footer = (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <Container>
        <p>&copy; {new Date().getFullYear()} Šášky, verze {pkg.version}</p>
      </Container>
    </footer>
  );
};
