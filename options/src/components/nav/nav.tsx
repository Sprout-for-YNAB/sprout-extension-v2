import styles from "./nav.module.css";
import { NavLink } from "react-router-dom";

export default function Nav() {
  const setActiveClass = ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
    `${styles.link} ${isPending ? styles.pending : isActive ? styles.active : ""}`;

  return (
    <div>
      <nav className={styles.nav}>
        <NavLink to="/display" className={setActiveClass}>
          Display
        </NavLink>
        <NavLink to="/behavior" className={setActiveClass}>
          Behavior
        </NavLink>
        <NavLink to="/data" className={setActiveClass}>
          Data
        </NavLink>
        <NavLink to="/disconnect" className={setActiveClass}>
          Disconnect
        </NavLink>
        <NavLink to="/about" className={setActiveClass}>
          About
        </NavLink>
      </nav>
    </div>
  );
}
