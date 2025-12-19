import styles from './Home.module.css';

export default function AdminDashboard() {

    return (
        <section className={styles.admin}>
            <h1>Admin Dashboard</h1>
            <p>lista urzadzen, ilosc plynow, edycja urzadzen</p>
        </section>
    );
}