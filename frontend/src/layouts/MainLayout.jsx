import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Icon from '../components/common/Icon.jsx';
import { getApiCurrentUser } from '../services/api.js';

const storeNames = { 'STR-104': 'Nugegoda Store', 'STR-305': 'Colombo Central Hub', 'STR-412': 'Kandy City Depot' };

export default function MainLayout() {
  const { pathname } = useLocation();
  const user = getApiCurrentUser();
  const isAdmin = user?.role === 'admin';
  const storeName = storeNames[user?.storeId] || (user?.storeId ? `Store ${user.storeId}` : 'Store Portal');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (pathname !== '/bookings/create') {
    return <div className="app-main"><Outlet /></div>;
  }

  return (
    <div className="store-portal">
      <header className="header">
        <NavLink to="/bookings/create" className="brand"><span className="brand-icon"><Icon name="truck" size={28} /></span>FleetFlow</NavLink>
        <nav aria-label="Portal navigation"><NavLink to="/bookings/create">Booking</NavLink>{!isAdmin && <NavLink to="/bookings">My bookings</NavLink>}</nav>
        <span className="portal-label">{isAdmin ? 'ADMIN PORTAL' : 'STORE PORTAL'}</span>
      </header>
      <div className="workspace">
        <aside className="sidebar">
          <p className="eyebrow">{isAdmin ? 'ADMIN WORKSPACE' : 'STORE WORKSPACE'}</p>
          <nav aria-label="Store navigation">
            <NavLink to="/bookings/create"><span aria-hidden="true">▤</span>Create Booking</NavLink>
            {!isAdmin && <NavLink to="/bookings"><span aria-hidden="true">☷</span>My Bookings</NavLink>}
            <span className="planned-nav" aria-disabled="true" title="Schedule will be integrated by the assigned team member"><span aria-hidden="true">◷</span>Schedule</span>
          </nav>
          {!isAdmin && <div className="facility"><span className="status-dot" /><div><strong>{storeName}</strong><small>{user?.storeId || 'Current facility'}</small></div></div>}
        </aside>
        <main className="content">        <div className="demo-notice">Bookings are submitted for dispatch review and saved to the service.</div><Outlet /></main>
      </div>
      <footer className="footer">
        <div><div className="brand"><span className="brand-icon"><Icon name="truck" size={28} /></span>FleetFlow</div><p>Simplifying fleet operations, store scheduling<br />and delivery coordination.</p></div>
        <div><strong>{isAdmin ? 'ADMIN WORKSPACE' : 'STORE WORKSPACE'}</strong><NavLink to="/bookings/create">Create a booking</NavLink><p>Booking and delivery coordination</p></div>
        <div className="footer-bottom">© {new Date().getFullYear()} FleetFlow. Team A6.<span>Smart Fleet &amp; Store Transportation</span></div>
      </footer>
    </div>
  );
}
