import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

// Store portal shell. The authentication feature can wrap this route group later.
export default function MainLayout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return <div className="store-portal">
    <header className="header">
      <NavLink to="/bookings/create" className="brand"><span className="brand-icon">▰</span>FleetFlow</NavLink>
      <nav aria-label="Store portal navigation"><NavLink to="/bookings/create">Booking</NavLink></nav>
      <span className="portal-label">STORE PORTAL</span>
    </header>
    <div className="workspace">
      <aside className="sidebar">
        <p className="eyebrow">STORE WORKSPACE</p>
        <nav aria-label="Store navigation">
          <NavLink to="/bookings/create"><span aria-hidden="true">▤</span>Create Booking</NavLink>
          <span className="planned-nav" aria-disabled="true" title="Booking history will be integrated by the assigned team member"><span aria-hidden="true">☷</span>My Bookings</span>
          <span className="planned-nav" aria-disabled="true" title="Schedule will be integrated by the assigned team member"><span aria-hidden="true">◷</span>Schedule</span>
        </nav>
        <div className="facility"><span className="status-dot"/><div><strong>Nugegoda Store</strong><small>Store #104 · Active facility</small></div></div>
      </aside>
      <main className="content"><div className="demo-notice">Frontend preview · Booking drafts are saved in this browser and are not sent to the server.</div><Outlet /></main>
    </div>
    <footer className="footer">
      <div><div className="brand">▰ FleetFlow</div><p>Simplifying fleet operations, store scheduling<br/>and delivery coordination.</p></div>
      <div><strong>STORE WORKSPACE</strong><NavLink to="/bookings/create">Create a booking</NavLink><p>Store booking & delivery coordination</p></div>
      <div className="footer-bottom">© {new Date().getFullYear()} FleetFlow. Team A6.<span>Smart Fleet & Store Transportation</span></div>
    </footer>
  </div>;
}
