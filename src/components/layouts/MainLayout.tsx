import classes from "../../styles/MainLayout.module.css";
import SideNav from "./core/SideNav";
import TopBar from "./core/TopBar";

export default function MainLayout({ children }) {
  return (
    <>
      <div className={classes.layout}>
        <div className={classes.side}>
          <SideNav />
        </div>
        <div className={classes.main}>
          <TopBar />
          <main>{children}</main>
        </div>
      </div>
    </>
  );
}
