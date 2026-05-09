import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

// Wraps all standard (non-admin, non-auth, non-checkout) pages with the
// shared Navbar so it doesn't have to be imported in every page component.
export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
