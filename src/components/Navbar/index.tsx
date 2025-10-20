import { JSX } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

export const Navbar = (): JSX.Element => {
  return (
    <nav className={styles.navbar}>
      <div className={clsx('container', styles.navContainer)}>
        <a href="/" className={styles.navBrand}>Šášky</a>
        <div className={styles.navLinks}>
          <a href="/" className={styles.navLink}>Seznam her</a>
          <a href="/players" className={styles.navLink}>Hráči</a>
          <a href="/enter" className={styles.navLink}>Zadat hru</a>
        </div>
      </div>
    </nav>
  );
};
