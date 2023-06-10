import classes from "../../styles/MainLayout.module.css";
import SideNav from "./core/SideNav";
import TopBar from "./core/TopBar";
import {Typography} from "@material-ui/core";

export default function MainLayout({children}) {
    return (
        <>
            <section className={classes.layout}>
                <section className={classes.side}>
                    <SideNav/>
                </section>
                <section className={classes.main}>
                    <TopBar/>
                    <main>{children}</main>
                </section>
            </section>
            <div className={classes.noview}>
                <div>
                    <Typography variant={'h5'} style={{height: 'fit-content', fontWeight: 'bold'}}>Sorry, you cannot access this app on
                        mobile.</Typography>
                    <Typography variant={'body1'} style={{height: 'fit-content', marginTop: '20px'}}>Try accessing it from your PC or a tablet.</Typography>
                </div>
            </div>
        </>
    );
}
