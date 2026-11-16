import React, { useState } from 'react';
import {
  Truck, LayoutGrid, Calendar, Car, Store, GitFork, SlidersHorizontal,
  Clock, Search, HelpCircle, Bell, Download, Plus, CheckCircle2,
  Ban, Activity, MapPin, Infinity as InfinityIcon, MoreVertical, Network
} from 'lucide-react';

const STORES_DATA = [
  {
    id: 'STR-104',
    name: 'Nugegoda Super Center #104',
    address: '142 High Level Rd • Retail Hub',
    location: 'Colombo (Western)',
    coords: '6.8649° N, 79.8997° E',
    contact: 'Kasun Herath',
    phone: '+94 77 124 9901',
    hours: '07:00 – 21:00',
    isShifted: false,
    status: 'Active',
  },
  {
    id: 'STR-218',
    name: 'Maharagama Retail Hub #218',
    address: '89 Old Rd • Delivery Point',
    location: 'Maharagama (Western)',
    coords: '6.8480° N, 79.9267° E',
    contact: 'Saman Perera',
    phone: '+94 71 883 4110',
    hours: '08:00 – 20:00',
    isShifted: false,
    status: 'Active',
  },
  {
    id: 'STR-305',
    name: 'Colombo Central Hub (CDC)',
    address: 'Port Access Gate 04 • Central Distribution',
    location: 'Colombo 01 (Western)',
    coords: '6.9344° N, 79.8428° E',
    contact: 'Kavinda Perera',
    phone: '+94 11 249 9000',
    hours: '24 Hours / Shifted',
    isShifted: true,
    status: 'Active Depot',
  },
  {
    id: 'STR-412',
    name: 'Kandy City Depot #312',
    address: '22 William Gopallawa Mawatha',
    location: 'Kandy City (Central)',
    coords: '7.2906° N, 80.6337° E',
    contact: 'Ruwan Silva',
    phone: '+94 81 223 1099',
    hours: '08:30 – 19:30',
    isShifted: false,
    status: 'Maintenance',
  },
  {
    id: 'STR-508',
    name: 'Galle Fort Delivery Center #108',
    address: '54 Light House St • Southern Bay',
    location: 'Galle Fort (Southern)',
    coords: '6.0267° N, 80.2170° E',
    contact: 'Chaminda Dias',
    phone: '+94 91 224 5511',
    hours: '08:00 – 18:00',
    isShifted: false,
    status: 'Active',
  },
];

export default function AdminStoreManagement({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [regionFilter, setRegionFilter] = useState('All Regions');

  const filteredStores = STORES_DATA.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All statuses' || store.status === statusFilter;
    const matchesRegion =
      regionFilter === 'All Regions' || store.location.includes(regionFilter);
    return matchesSearch && matchesStatus && matchesRegion;
  });

  return (
    <div className="ff-layout">
      {/* Left Sidebar */}
      <aside className="ff-sidebar">
        <div>
          <div className="ff-brand">
            <div className="ff-brand-icon">
              <Truck size={20} />
            </div>
            <div>
              <div className="ff-brand-title">
                FleetFlow <span className="ff-admin-badge">ADMIN</span>
              </div>
              <div className="ff-brand-sub">LOGISTICS CLOUD</div>
            </div>
          </div>

          <div className="ff-nav-section">
            <div className="ff-nav-label">OPERATIONS</div>
            <div className="ff-nav-item" onClick={() => onNavigate && onNavigate('home')}>
              <span className="ff-nav-left"><LayoutGrid size={17} /> Overview</span>
            </div>
            <div className="ff-nav-item">
              <span className="ff-nav-left"><Calendar size={17} /> Bookings</span>
            </div>
            <div className="ff-nav-item">
              <span className="ff-nav-left"><Car size={17} /> Vehicles</span>
            </div>
            <div className="ff-nav-item active" onClick={() => onNavigate && onNavigate('stores')}>
              <span className="ff-nav-left"><Store size={17} /> Stores</span>
              <span className="ff-active-dot"></span>
            </div>
            <div className="ff-nav-item">
              <span className="ff-nav-left"><GitFork size={17} /> Trips</span>
            </div>
            <div className="ff-nav-item" onClick={() => onNavigate && onNavigate('config')}>
              <span className="ff-nav-left"><SlidersHorizontal size={17} /> Store Configuration</span>
            </div>
            <div className="ff-nav-item" onClick={() => onNavigate && onNavigate('schedules')}>
              <span className="ff-nav-left"><Clock size={17} /> Store Schedules</span>
            </div>
          </div>
        </div>

        <div className="ff-sidebar-footer">
          <div className="ff-depot-card">
            <div className="ff-depot-info">
              <Network size={18} color="#475569" />
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>ACTIVE DEPOT</div>
                <div style={{ fontSize: '12px', fontWeight: 700 }}>Colombo Central Hub</div>
              </div>
            </div>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ff-main-wrapper">
        <header className="ff-topbar">
          <div className="ff-global-search">
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input type="text" placeholder="Search fleet, stores, runs..." />
          </div>

          <div className="ff-topbar-right">
            <button className="ff-icon-btn"><HelpCircle size={18} /></button>
            <button className="ff-icon-btn">
              <Bell size={18} />
              <span className="ff-notif-dot"></span>
            </button>
            <div className="ff-profile">
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Kavinda Perera</span>
              <div className="ff-avatar">KP</div>
            </div>
          </div>
        </header>

        <main className="ff-content">
          <div className="ff-page-header">
            <h1 className="ff-page-title">Stores</h1>
            <div className="ff-header-actions">
              <button className="ff-btn-secondary">
                <Download size={15} /> Export CSV
              </button>
              <button className="ff-btn-primary">
                <Plus size={16} /> Add Store
              </button>
            </div>
          </div>

          <div className="ff-kpi-grid">
            <div className="ff-kpi-card">
              <div>
                <div className="ff-kpi-label">TOTAL REGISTERED</div>
                <div className="ff-kpi-value" style={{ color: '#0f172a' }}>48</div>
              </div>
              <div className="ff-kpi-icon-box" style={{ background: '#f8fafc', color: '#475569' }}>
                <Store size={19} />
              </div>
            </div>

            <div className="ff-kpi-card">
              <div>
                <div className="ff-kpi-label">ACTIVE INTAKE</div>
                <div className="ff-kpi-value" style={{ color: '#059669' }}>46</div>
              </div>
              <div className="ff-kpi-icon-box" style={{ background: '#ecfdf5', color: '#059669', borderColor: '#d1fae5' }}>
                <CheckCircle2 size={19} />
              </div>
            </div>

            <div className="ff-kpi-card">
              <div>
                <div className="ff-kpi-label">MAINTENANCE / HOLD</div>
                <div className="ff-kpi-value" style={{ color: '#b45309' }}>2</div>
              </div>
              <div className="ff-kpi-icon-box" style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fee2e2' }}>
                <Ban size={19} />
              </div>
            </div>

            <div className="ff-kpi-card">
              <div>
                <div className="ff-kpi-label">SYNC LATENCY</div>
                <div className="ff-kpi-value" style={{ color: '#245a4f' }}>140ms</div>
              </div>
              <div className="ff-kpi-icon-box" style={{ background: '#f0fdfa', color: '#0d9488', borderColor: '#ccfbf1' }}>
                <Activity size={19} />
              </div>
            </div>
          </div>

          <div className="ff-table-container">
            <div className="ff-filter-bar">
              <div className="ff-table-search">
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                <input
                  type="text"
                  placeholder="Search by store name, code or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="ff-filter-controls">
                <select
                  className="ff-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All statuses">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Active Depot">Active Depot</option>
                  <option value="Maintenance">Maintenance</option>
                </select>

                <select
                  className="ff-select"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="All Regions">All Regions</option>
                  <option value="Western">Western</option>
                  <option value="Central">Central</option>
                  <option value="Southern">Southern</option>
                </select>

                <div className="ff-showing-pill">
                  Showing {filteredStores.length} stores
                </div>
              </div>
            </div>

            <table className="ff-table">
              <thead>
                <tr>
                  <th>STORE ID</th>
                  <th>STORE NAME</th>
                  <th>LOCATION</th>
                  <th>CONTACT PERSON</th>
                  <th>OPERATING HOURS</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((store) => (
                  <tr key={store.id}>
                    <td className="ff-store-id">{store.id}</td>
                    <td>
                      <div className="ff-store-name">{store.name}</div>
                      <div className="ff-store-sub">{store.address}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                        <MapPin size={14} color="#245a4f" /> {store.location}
                      </div>
                      <div className="ff-store-sub" style={{ paddingLeft: '19px' }}>{store.coords}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{store.contact}</div>
                      <div className="ff-store-sub">{store.phone}</div>
                    </td>
                    <td>
                      <span className={`ff-hours-badge ${store.isShifted ? 'shifted' : ''}`}>
                        {store.isShifted ? <InfinityIcon size={14} /> : <Clock size={14} />}
                        {store.hours}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`ff-status-pill ${
                          store.status === 'Maintenance' ? 'ff-status-maint' : 'ff-status-active'
                        }`}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: store.status === 'Maintenance' ? '#dc2626' : '#059669',
                          }}
                        ></span>
                        {store.status}
                      </span>
                    </td>
                    <td>
                      <div className="ff-action-cell">
                        <button className="ff-edit-btn" onClick={() => onNavigate && onNavigate('config')}>Edit</button>
                        <MoreVertical size={16} color="#64748b" style={{ cursor: 'pointer' }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ff-pagination">
              <div>Showing <strong>1</strong> to <strong>{filteredStores.length}</strong> of <strong>48</strong> stores</div>
              <div className="ff-page-btns">
                <button className="ff-page-btn" disabled style={{ color: '#94a3b8' }}>Previous</button>
                <button className="ff-page-btn active">1</button>
                <button className="ff-page-btn">2</button>
                <button className="ff-page-btn">3</button>
                <button className="ff-page-btn">Next</button>
              </div>
            </div>
          </div>
        </main>

        <footer className="ff-footer">
          <span>© 2026 FleetFlow. All rights reserved.</span>
          <span style={{ color: '#059669', fontWeight: 600 }}>• Systems Operational</span>
        </footer>
      </div>
    </div>
  );
}