import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from './Layout.module.css';

function Layout() {
    const { pathname } = useLocation();
    const isAuth = pathname.startsWith('/auth');

    return (
        <div className={styles.shell}>
            <Navbar />
            <main className={isAuth ? styles.auth : styles.main}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;