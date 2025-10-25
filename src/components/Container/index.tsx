import { JSX } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface Props {
  className?: string;
  width?: 'standard' | 'narrow';
  children: React.ReactNode;
}

export const Container = ({ children, className, width = 'standard' }: Props): JSX.Element => {
  return (
    <div className={clsx(styles.container, styles[width], className)}>
      {children}
    </div>
  );
};
