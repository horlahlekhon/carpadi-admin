import styles from "../../../styles/TopBar.module.css";

function TopBar() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Carpadi</div>
      <nav>nav</nav>
    </header>
  );
}

export default TopBar;
