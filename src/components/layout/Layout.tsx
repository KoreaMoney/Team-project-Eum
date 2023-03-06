import Footer from './Footer';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import MoveTop from '../etc/MoveTop';

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <MoveTop />
      <Footer />
    </div>
  );
};

export default Layout;
