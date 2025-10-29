import { JSX } from "react";
import clsx from "clsx";
import { Panel } from "../Panel/index.js";
import { Icon } from "../Icon/index.js";
import styles from "./styles.module.css";

export type AlertVariant = "info" | "warning" | "error" | "success";

interface Props {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert = ({ variant, title, children, className }: Props): JSX.Element => {
  return (
    <Panel className={clsx(styles.alert, styles[variant], className)}>
      <div className={styles.alertContent}>
        <div className={styles.alertIcon}>
          <Icon name="x-circle" />
        </div>
        <div className={styles.alertBody}>
          {title && <div className={styles.alertTitle}>{title}</div>}
          <div className={styles.alertMessage}>{children}</div>
        </div>
      </div>
    </Panel>
  );
};
