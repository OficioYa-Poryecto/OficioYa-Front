import styles from './ProfileView.module.css';

// Correo y teléfonos tal como los manda el back: enmascarados en /users/me (RF-03), completos para el admin (RF-08)
function ContactCard({ email, phones, nota }) {
    const ordenados = [...phones].sort((a, b) => Number(b.principal) - Number(a.principal));

    return (
        <section className={`card ${styles.contact}`}>
            <h2>Datos de contacto</h2>
            <div className={styles.contactItem}>
                <span className={styles.icon} aria-hidden="true">✉</span>
                <div>
                    <small>Correo</small>
                    <strong>{email}</strong>
                </div>
            </div>
            {ordenados.map((phone, i) => (
                <div key={phone.id} className={styles.contactItem}>
                    <span className={styles.icon} aria-hidden="true">☎</span>
                    <div>
                        <small>{i === 0 ? 'Teléfono principal' : `Teléfono alterno ${i}`}</small>
                        <strong>{phone.number}</strong>
                    </div>
                </div>
            ))}
            <p className={styles.privacy}>
                🔒 {nota}
            </p>
        </section>
    );
}

export default ContactCard;