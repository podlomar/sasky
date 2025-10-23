import { JSX } from "react";
import styles from "./styles.module.css";

interface Props {
  children: React.ReactNode;
}

export const Container = ({ children }: Props): JSX.Element => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
};
