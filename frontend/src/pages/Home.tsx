import styles from './Home.module.css';


export default function Home() {
    return (

        <section className={styles.home}>
            <h1>Witamy w firmie X</h1>
            <p>Nowoczesne zarządzanie automatami czyszczącymi - lokalizacja na mapie, poziom płynów, alerty</p>
        </section>
    );
}