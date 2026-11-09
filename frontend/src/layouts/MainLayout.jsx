import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
export default function MainLayout() {
  const { pathname } = useLocation();
  const admin = pathname.startsWith('/admin');
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return <>
    <header className="header"><NavLink to="/bookings/create" className="brand"><span className="brand-icon">▰</span>FleetFlow</NavLink><nav aria-label="Portal navigation"><NavLink to="/bookings/create">Store portal</NavLink><NavLink to="/admin/vehicles">Admin workspace</NavLink></nav><span className="avatar" aria-label="Demo user">HP</span></header>
    <div className="workspace"><aside className="sidebar"><p className="eyebrow">WORKSPACE</p><nav aria-label="Feature navigation"><NavLink to="/bookings/create"><span aria-hidden="true">▤</span>Create Booking</NavLink><NavLink to="/admin/vehicles"><span aria-hidden="true">▱</span>Vehicles</NavLink><NavLink to="/admin/items"><span aria-hidden="true">▦</span>Item Catalog</NavLink></nav><div className="facility"><span className="status-dot"/><div><strong>{admin ? 'Admin workspace' : 'Nugegoda Store'}</strong><small>{admin ? 'Fleet & catalog management' : 'Store #104 · Active facility'}</small></div></div></aside>
    <main className="content"><div className="demo-notice">Frontend preview · Sample data is saved in this browser. Admin access and bookings are not connected to the server yet.</div><Outlet /></main></div>
    <footer className="footer"><div><div className="brand">▰ FleetFlow</div><p>Simplifying fleet operations, store scheduling<br/>and delivery coordination.</p></div><div><strong>YOUR WORKSPACE</strong><NavLink to="/bookings/create">Create a booking</NavLink><NavLink to="/admin/vehicles">Vehicle management</NavLink><NavLink to="/admin/items">Item catalog</NavLink></div><div className="footer-bottom">© {new Date().getFullYear()} FleetFlow. Team A6.<span>Smart Fleet & Store Transportation</span></div></footer>
  </>;
}
