import { JSX } from "react";
import styles from './styles.module.css';

interface Props {
  title: string;
  subtitle?: string;
}

export const PageHeader = ({ title, subtitle }: Props): JSX.Element => {
  return (
    <header className={styles.pageHeader}>
      <h1>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
};
