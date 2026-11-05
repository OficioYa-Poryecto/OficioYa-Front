    import { Outlet } from 'react-router-dom';
    import Navbar from './Navbar';

    function Layout() {
      return (
        <>
          <Navbar />
          <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
            <Outlet />
          </main>
        </>
      );
    }

    export default Layout;