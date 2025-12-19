import type { ReactNode } from "react";
import Header from "./Header";
import styles from "./Layout.module.css";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className={styles.shell}>
            <Header />
            <main className={styles.main}>{children}</main>
        </div>
    );
}