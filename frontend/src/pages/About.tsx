import styles from './About.module.css';

export default function About() {
    return (
    
        <section className={styles.about}>
            <h1>O nas</h1>
            <p>Firma X specjalizuje się w zarządzaniu automatami czyszczącymi z wykorzystaniem nowoczesnych technologii IoT. Nasza platforma umożliwia monitorowanie lokalizacji urządzeń, poziomu płynów oraz generowanie alertów w czasie rzeczywistym.</p>
        </section>
    );

}