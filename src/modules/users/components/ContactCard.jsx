import Icon from './Icon';
import styles from './ProfileView.module.css';

// Correo y teléfonos tal como los manda el back: enmascarados en /users/me (RF-03), completos para el admin (RF-08)
function ContactCard({ email, phones, nota }) {
    const principal = phones.find((phone) => phone.principal);
    const alternos = phones.filter((phone) => !phone.principal).map((phone) => phone.number);
    const datos = [
        { key: 'email', icon: 'mail', etiqueta: 'Correo', valores: [email] },
        principal && { key: 'principal', icon: 'phone', etiqueta: 'Teléfono principal', valores: [principal.number] },
        alternos.length > 0 && {
            key: 'alternos',
            icon: 'phone',
            etiqueta: alternos.length > 1 ? 'Teléfonos alternos' : 'Teléfono alterno',
            valores: alternos,
        },
    ].filter(Boolean);

    return (
        <section className={`card ${styles.contact}`}>
            <h2>Datos de contacto</h2>
            <div className={styles.contactList}>
                {datos.map((dato) => (
                    <div key={dato.key} className={styles.contactItem}>
                        <span className={styles.contactIcon}><Icon name={dato.icon} size={22} /></span>
                        <div className={styles.contactText}>
                            <span className={styles.contactLabel}>{dato.etiqueta}</span>
                            {dato.valores.map((valor, i) => (
                                <strong key={i} className={styles.contactValue}>{valor}</strong>
                            ))}
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