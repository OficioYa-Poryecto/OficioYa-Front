import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  const { pathname } = useLocation();
  const isAuth = pathname.startsWith('/auth');

  return (
    <>
      <Navbar />
      <main style={isAuth ? {} : { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
