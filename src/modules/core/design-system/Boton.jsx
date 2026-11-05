import Icon from './Icon';
import styles from './Boton.module.css';

function Boton({ children, variant = 'primary', icon, className = '', type = 'button', ...props }) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${className}`} type={type} {...props}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

export default Boton;
