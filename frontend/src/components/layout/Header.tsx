import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
    
    const {user, logout} = useAuth();

    return (
        <header className={styles.bar}>
            <div className={styles.brand}>Firma X</div>
            <nav className={styles.nav}>
                <Link to="/">Strona główna</Link>
                <Link to="/map">Mapa</Link>
                <Link to="/about">O nas</Link>
                <Link to="/contact">Kontakt</Link>
                {user?.role === "admin" && <Link to="/admin">Panel Admina</Link>}
            </nav>
            <div className={styles.spacer}></div>
            <div className={styles.user}>
                {user ? <>
                {user.name ?? user.role} <button onClick={logout}>Logout</button></> : <Link to="/login">Zaloguj</Link>}
            </div>
        </header>
    );
}