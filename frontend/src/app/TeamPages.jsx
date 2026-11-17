import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Home from '../pages/HomePage.jsx';
import AdminStoreManagement from '../features/stores/AdminStoreManagement.jsx';
import AdminStoreConfiguration from '../features/stores/AdminStoreConfiguration.jsx';
import AdminStoreScheduleOversight from '../features/schedules/AdminStoreScheduleOversight.jsx';

export default function TeamPages() {
  const [activeTab, setActiveTab] = useState('stores');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>

      {/* Top Switcher Bar */}
      <div style={{
        backgroundColor: '#1b3b34',
        color: 'white',
        padding: '12px 20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <span style={{ fontWeight: 'bold', color: '#10b981', fontSize: '14px' }}>FleetFlow Pages:</span>

        <button
          onClick={() => setActiveTab('stores')}
          style={{ padding: '6px 14px', background: activeTab === 'stores' ? '#10b981' : '#16302a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Store Management
        </button>

        <button
          onClick={() => setActiveTab('config')}
          style={{ padding: '6px 14px', background: activeTab === 'config' ? '#10b981' : '#16302a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Store Config
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          style={{ padding: '6px 14px', background: activeTab === 'schedules' ? '#10b981' : '#16302a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Schedule Oversight
        </button>

        <button
          onClick={() => setActiveTab('home')}
          style={{ padding: '6px 14px', background: activeTab === 'home' ? '#10b981' : '#16302a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Home Page
        </button>
        <Link to="/bookings/create" style={{ color: 'white' }}>Create Booking</Link>
        <Link to="/admin/vehicles" style={{ color: 'white' }}>Vehicles</Link>
        <Link to="/admin/items" style={{ color: 'white' }}>Item Catalog</Link>
      </div>

      {/* Main Content Area (Passing onNavigate to Pages) */}
      <main>
        {activeTab === 'stores' && <AdminStoreManagement onNavigate={setActiveTab} />}
        {activeTab === 'config' && <AdminStoreConfiguration onNavigate={setActiveTab} />}
        {activeTab === 'schedules' && <AdminStoreScheduleOversight onNavigate={setActiveTab} />}
        {activeTab === 'home' && <Home onNavigate={setActiveTab} />}
      </main>

    </div>
  );
}
