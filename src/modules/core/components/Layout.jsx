import { Outlet } from 'react-router-dom';
import ui from '../design-system/ui.module.css';
import Footer from './Footer';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className={ui.appShell}>
      <Navbar />
      <main className={ui.appContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
