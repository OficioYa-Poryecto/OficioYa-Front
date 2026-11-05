import { useNavigate } from 'react-router-dom';
import Boton from '../../core/design-system/Boton';
import Field from '../../core/design-system/Field';
import Icon from '../../core/design-system/Icon';
import ui from '../../core/design-system/ui.module.css';
import styles from './auth.module.css';

const BENEFITS = [
  'Perfil adaptado a tu rol',
  'Datos personales protegidos',
  'Sin pagos ni comisiones',
];

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className={`${ui.page} ${styles.accessPage}`}>
      <div className={styles.accessHeading}>
        <p className="eyebrow">Bienvenido a OficioYa</p>
        <h1>Tu espacio en OficioYa</h1>
        <p>Inicia sesión si ya tienes cuenta o crea una nueva para empezar.</p>
      </div>
      <div className={styles.accessGrid}>
        <section className={`${ui.formCard} ${styles.accessCard}`}>
          <span className={styles.accessIcon}><Icon name="lock" size={24} /></span>
          <div>
            <p className="eyebrow">Ya tengo una cuenta</p>
            <h2>Iniciar sesión</h2>
            <p>Ingresa tus datos para continuar a tu perfil.</p>
          </div>
          <div className={styles.accessFields}>
            <Field label="Correo electrónico" placeholder="tu@correo.com" type="email" />
            <Field label="Contraseña" placeholder="Tu contraseña" type="password" />
          </div>
          <Boton className={styles.cardAction} onClick={() => navigate('/contratante/perfil')}>
            Iniciar sesión
          </Boton>
          <Boton className={styles.forgotLink} variant="ghost">¿Olvidaste tu contraseña?</Boton>
        </section>
        <section className={`${ui.formCard} ${styles.accessCard} ${styles.createAccountCard}`}>
          <span className={styles.accessIcon}><Icon name="user" size={26} /></span>
          <div>
            <p className="eyebrow">Soy nuevo en OficioYa</p>
            <h2>Crear una cuenta</h2>
            <p>
              Completa tus datos y configura tu perfil de contratante. Es gratis y solo toma
              unos minutos.
            </p>
          </div>
          <ul>
            {BENEFITS.map((benefit) => (
              <li key={benefit}><Icon name="check" size={14} /> {benefit}</li>
            ))}
          </ul>
          <Boton className={styles.cardAction} onClick={() => navigate('/registro')} variant="outline">
            Crear cuenta
          </Boton>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
