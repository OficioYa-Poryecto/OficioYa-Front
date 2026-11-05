    import { Link } from 'react-router-dom';
    import logo from '../../../assets/logo.png';
    import styles from './Navbar.module.css';

    function Navbar() {
      return (
        <header className={styles.navbar}>
          <Link to="/" aria-label="OficioYa">
            <img src={logo} alt="OficioYa" className={styles.logo} />
          </Link>
        </header>
      );
    }

    export default Navbar;