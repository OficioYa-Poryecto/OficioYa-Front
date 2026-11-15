import Icon from './Icon';
import styles from './ProfileView.module.css';

// Correo y teléfonos tal como los manda el back: enmascarados en /users/me (RF-03), completos para el admin (RF-08)
function ContactCard({ email, phones, nota }) {
    const ordenados = [...phones].sort((a, b) => Number(b.principal) - Number(a.principal));
    const datos = [
        { key: 'email', icon: 'mail', etiqueta: 'Correo', valor: email },
        ...ordenados.map((phone, i) => ({
            key: phone.id,
            icon: 'phone',
            etiqueta: i === 0 ? 'Teléfono principal' : `Teléfono alterno ${i}`,
            valor: phone.number,
        })),
    ];

    return (
        <section className={`card ${styles.contact}`}>
            <h2>Datos de contacto</h2>
            <div className={styles.contactList}>
                {datos.map((dato) => (
                    <div key={dato.key} className={styles.contactItem}>
                        <span className={styles.contactIcon}><Icon name={dato.icon} size={22} /></span>
                        <div className={styles.contactText}>
                            <span className={styles.contactLabel}>{dato.etiqueta}</span>
                            <strong className={styles.contactValue}>{dato.valor}</strong>
                        </div>
                    </div>
                ))}
            </div>
            <p className={styles.privacy}>
                <Icon name="lock" size={18} />
                <span>{nota}</span>
            </p>
        </section>
    );
}

export default ContactCard;