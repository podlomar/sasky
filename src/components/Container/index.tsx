import { JSX } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const Container = ({ children, className }: Props): JSX.Element => {
  return (
    <div className={clsx(styles.container, className)}>
      {children}
    </div>
  );
};
