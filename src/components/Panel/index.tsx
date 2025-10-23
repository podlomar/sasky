import { JSX } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const Panel = ({ children, className }: Props): JSX.Element => {
  return (
    <div className={clsx(styles.panel, className)}>
      {children}
    </div>
  );
};
