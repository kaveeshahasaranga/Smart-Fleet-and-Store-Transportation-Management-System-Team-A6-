import React from 'react';
import {
  Truck, LayoutGrid, Calendar, Car, Store, GitFork, SlidersHorizontal, Clock,
  Search, HelpCircle, Bell, Network, PlusCircle, Wrench
} from 'lucide-react';

const HOURS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

export default function AdminStoreScheduleOversight({ onNavigate }) {
  return (
    <div className="ff-layout">
      {/* Left Sidebar (7 Items Matching Other Pages) */}
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
            <div className="ff-nav-item" onClick={() => onNavigate && onNavigate('stores')}>
              <span className="ff-nav-left"><Store size={17} /> Stores</span>
            </div>
            <div className="ff-nav-item">
              <span className="ff-nav-left"><GitFork size={17} /> Trips</span>
            </div>
            <div className="ff-nav-item" onClick={() => onNavigate && onNavigate('config')}>
              <span className="ff-nav-left"><SlidersHorizontal size={17} /> Store Configuration</span>
            </div>
            <div className="ff-nav-item active" onClick={() => onNavigate && onNavigate('schedules')}>
              <span className="ff-nav-left"><Clock size={17} /> Store Schedules</span>
              <span className="ff-active-dot"></span>
            </div>
          </div>
        </div>

        <div className="ff-sidebar-footer">
          <div className="ff-depot-card">
            <div className="ff-depot-info">
              <Network size={18} color="#245a4f" />
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>ACTIVE DEPOT</div>
                <div style={{ fontSize: '12px', fontWeight: 700 }}>Colombo Central Hub</div>
              </div>
            </div>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#245a4f' }}></span>
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
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Kavinda Perera</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Ops Supervisor</div>
              </div>
              <div className="ff-avatar">KP</div>
            </div>
          </div>
        </header>

        <main className="ff-content">
          <div className="ff-page-header" style={{ marginBottom: '16px' }}>
            <h1 className="ff-page-title">Store Schedule Oversight</h1>
          </div>

          <div className="ff-sched-top-box">
            <div className="ff-sched-store-badge">
              <Store size={19} />
            </div>
            <button className="ff-sched-cal-btn">
              <Calendar size={15} />
              <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                <div>Single Store</div>
                <div>Bay Calendar</div>
              </div>
            </button>
          </div>

          <div className="ff-legend-bar">
            <div className="ff-legend-items">
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>BAY TRACK LEGEND:</span>
              <span>
                <span className="ff-legend-dot" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}></span>
                Available Slot
              </span>
              <span>
                <span className="ff-legend-dot" style={{ background: '#2b675b' }}></span>
                Confirmed / Reserved
              </span>
              <span>
                <span className="ff-legend-dot" style={{ background: '#f5cbb7' }}></span>
                Pending Acceptance
              </span>
              <span>
                <span className="ff-legend-dot" style={{ background: '#dbe2f0' }}></span>
                Maintenance / Offline
              </span>
              <span style={{ color: '#dc2626' }}>
                <span className="ff-legend-dot" style={{ background: '#dc2626' }}></span>
                Critical Conflict
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#245a4f', fontWeight: 600 }}>
              • GPS Radar Synced: 8s ago
            </div>
          </div>

          <div className="ff-timeline-wrapper">
            <div className="ff-timeline-header">
              <div className="ff-timeline-bay-col">
                <Store size={14} /> INTAKE BAYS (CDC)
              </div>
              {HOURS.map((hour) => (
                <div key={hour} className="ff-timeline-hour">{hour}</div>
              ))}
            </div>

            {/* BAY 01 */}
            <div className="ff-bay-row">
              <div className="ff-bay-label-cell">
                <span className="ff-bay-num">01</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Bay 01 — Heavy</div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>Intake</div>
                </div>
              </div>
              <div className="ff-bay-track">
                <div className="ff-slot-card" style={{ gridColumn: '1 / 3' }}>
                  <div className="ff-slot-top">
                    <span className="ff-slot-code">BK-8831</span>
                    <span className="ff-slot-badge" style={{ background: '#d1fae5', color: '#065f46' }}>Unloaded</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Cargills Logistics</div>
                </div>

                <div className="ff-slot-card available" style={{ gridColumn: '3 / 5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700 }}>
                    <PlusCircle size={13} /> Available Window
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>10:00 AM - 12:00 PM</div>
                </div>

                <div className="ff-slot-card confirmed" style={{ gridColumn: '5 / 8' }}>
                  <div className="ff-slot-top">
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span className="ff-slot-code">BK-8849</span>
                      <span className="ff-slot-badge" style={{ background: '#d1fae5', color: '#065f46' }}>Intake Active</span>
                    </div>
                    <span style={{ fontSize: '10px', opacity: 0.9 }}>12:00 - 15:00</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Keells Supply Chain SL</div>
                </div>

                <div className="ff-slot-card" style={{ gridColumn: '8 / 10' }}>
                  <div className="ff-slot-top">
                    <span className="ff-slot-code">BK-8854</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Nestlé Lanka Fleet</div>
                </div>
              </div>
            </div>

            {/* BAY 02 */}
            <div className="ff-bay-row">
              <div className="ff-bay-label-cell">
                <span className="ff-bay-num">02</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Bay 02 — Chilled</div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>Goods</div>
                </div>
              </div>
              <div className="ff-bay-track">
                <div className="ff-slot-card available" style={{ gridColumn: '1 / 2' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>+</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>08:00</span>
                </div>

                <div className="ff-slot-card confirmed" style={{ gridColumn: '2 / 5' }}>
                  <div className="ff-slot-top">
                    <span className="ff-slot-code">BK-8837</span>
                    <span className="ff-slot-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>Chilled Dock</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Highland Dairies SL</div>
                </div>

                <div className="ff-slot-card pending" style={{ gridColumn: '5 / 7' }}>
                  <div className="ff-slot-top">
                    <span className="ff-slot-code">BK-8845</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Elephant House Dairy</div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#9a3412', textAlign: 'right', marginTop: '4px' }}>
                    Awaiting Driver
                  </div>
                </div>

                <div className="ff-slot-card" style={{ gridColumn: '7 / 10' }}>
                  <div className="ff-slot-top">
                    <span className="ff-slot-code">BK-8850</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Kotmale Farms Direct</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                    <Truck size={12} color="#245a4f" />
                    <span>Cap 85%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BAY 03 */}
            <div className="ff-bay-row conflict-row">
              <div className="ff-bay-label-cell">
                <span className="ff-bay-num danger">03</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#b91c1c' }}>Bay 03 — FMCG</div>
                  <div style={{ fontSize: '12px', color: '#b91c1c' }}>Rapid Dock</div>
                </div>
              </div>
              <div className="ff-bay-track">
                <div className="ff-slot-card" style={{ gridColumn: '1 / 3' }}>
                  <div className="ff-slot-top">
                    <span className="ff-slot-code">BK-8833</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Unilever Sri Lanka</div>
                </div>

                <div className="ff-slot-card" style={{ gridColumn: '5 / 7' }}>
                  <div className="ff-slot-top">
                    <span className="ff-slot-code">BK-8846</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Maliban Biscuit Mfr</div>
                </div>

                <div className="ff-slot-card confirmed" style={{ gridColumn: '7 / 10' }}>
                  <div className="ff-slot-top">
                    <span className="ff-slot-code">BK-8851</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Ceylon Cold Stores PLC</div>
                </div>
              </div>
            </div>

            {/* BAY 04 */}
            <div className="ff-bay-row">
              <div className="ff-bay-label-cell">
                <span className="ff-bay-num">04</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Bay 04 — Reverse</div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>Logistics</div>
                </div>
              </div>
              <div className="ff-bay-track">
                <div className="ff-slot-card" style={{ gridColumn: '1 / 4' }}>
                  <div className="ff-slot-top">
                    <span className="ff-slot-code">BK-8835</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Ceylon Beverage Dist.</div>
                </div>

                <div className="ff-slot-card offline" style={{ gridColumn: '4 / 7' }}>
                  <div className="ff-slot-top">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700 }}>
                      <Wrench size={13} /> Hydraulic Ramp Service
                    </span>
                    <span className="ff-slot-badge" style={{ background: '#ffffff', color: '#334155' }}>OFFLINE</span>
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 700, textAlign: 'right', color: '#475569', marginTop: '6px' }}>
                    11:00 - 14:00
                  </div>
                </div>
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