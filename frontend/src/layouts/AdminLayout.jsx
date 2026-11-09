import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import Icon from '../components/common/Icon.jsx';

// Presentation only: the authentication owner must add admin authorization.
export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return <div className="admin-shell">
    <aside className="sidebar admin-sidebar">
      <NavLink to="/admin/vehicles" className="brand"><span className="brand-icon"><Icon name="truck" size={21}/></span>FleetFlow<span className="admin-tag">ADMIN</span></NavLink>
      <p className="eyebrow">OPERATIONS</p>
      <nav aria-label="Admin navigation">
        <span className="planned-nav" aria-disabled="true"><Icon name="grid"/>Overview</span>
        <span className="planned-nav" aria-disabled="true"><Icon name="calendar"/>Bookings</span>
        <NavLink to="/admin/vehicles"><Icon name="van"/>Vehicles</NavLink>
        <NavLink to="/admin/items"><Icon name="grid"/>Item Catalog</NavLink>
        <span className="planned-nav" aria-disabled="true"><Icon name="store"/>Stores</span>
        <span className="planned-nav" aria-disabled="true"><Icon name="route"/>Trips</span>
      </nav>
      <div className="facility"><Icon name="depot" size={23}/><div><strong>Active depot</strong><small>Colombo Central Hub</small></div></div>
    </aside>
    <div className="admin-main">
      <header className="admin-header">
        <div className="admin-breadcrumb"><Icon name="grid" size={15}/><span>Regional Logistics › <strong>Western Depot #04</strong></span></div>
        <form className="admin-global-search" role="search" onSubmit={e=>{e.preventDefault();navigate(`/admin/vehicles${query?'?q='+encodeURIComponent(query):''}`);}}><Icon name="search" size={17}/><input aria-label="Search fleet" placeholder="Search fleet, stores, runs..." value={query} onChange={e=>setQuery(e.target.value)}/></form>
        <div className="admin-header-tools"><details className="header-popover"><summary aria-label="Help"><Icon name="help"/></summary><p>Search the fleet by registration or vehicle name. Use Add vehicle to register a new vehicle.</p></details><details className="header-popover"><summary aria-label="Notifications"><Icon name="bell"/></summary><p>No notifications in this local preview.</p></details></div>
        <span className="admin-profile"><span><strong>Demo Admin</strong><small>Ops Supervisor</small></span><span className="avatar" aria-label="Demo admin"><Icon name="user" size={18}/></span></span>
      </header>
      <main className="content"><Outlet /></main>
    </div>
  </div>;
}
