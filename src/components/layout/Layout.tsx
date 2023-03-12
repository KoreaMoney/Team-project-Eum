import Header from './Header';
import MoveTop from '../etc/MoveTop';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <MoveTop />
    </div>
  );
};

export default Layout;
