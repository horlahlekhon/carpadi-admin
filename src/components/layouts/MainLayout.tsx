import classes from "../../styles/MainLayout.module.css";
import SideNav from "./core/SideNav";
import TopBar from "./core/TopBar";

export default function MainLayout({ children }) {
  return (
    <>
      <section className={classes.layout}>
        <section className={classes.side}>
          <SideNav />
        </section>
        <section className={classes.main}>
          <TopBar />
          <main>{children}</main>
        </section>
      </section>
    </>
  );
}
