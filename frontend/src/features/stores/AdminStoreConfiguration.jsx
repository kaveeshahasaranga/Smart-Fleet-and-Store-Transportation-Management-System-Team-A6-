import React, { useState } from 'react';
import {
  Truck, LayoutGrid, Calendar, Car, Store, GitFork, SlidersHorizontal,
  Clock, Search, HelpCircle, Bell, Download, Save, ShieldCheck,
  MapPin, Wrench, Radio, Plus, Network, ArrowRight
} from 'lucide-react';

export default function AdminStoreConfiguration({ onNavigate }) {
  const [activeBuffer, setActiveBuffer] = useState('250m');
  const [autoConflict, setAutoConflict] = useState(true);
  const [overstayAlert, setOverstayAlert] = useState(true);
  const [hydraulicRamp, setHydraulicRamp] = useState(true);
  const [preCool, setPreCool] = useState(true);
  const [expressTurn, setExpressTurn] = useState(true);
  const [bayOperational, setBayOperational] = useState(false);

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
            <div className="ff-nav-label">OPERATIONS CORE</div>
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
            <div className="ff-nav-item active" onClick={() => onNavigate && onNavigate('config')}>
              <span className="ff-nav-left"><SlidersHorizontal size={17} /> Store Configuration</span>
              <span className="ff-active-dot"></span>
            </div>
            <div className="ff-nav-item" onClick={() => onNavigate && onNavigate('schedules')}>
              <span className="ff-nav-left"><Clock size={17} /> Store Schedules</span>
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
                <div style={{ fontSize: '10px', color: '#059669' }}>• Active Transfer Zone 01</div>
              </div>
            </div>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Stores / Colombo Central Hub (CDC) / <strong style={{ color: '#0f172a' }}>Configuration</strong>
            </span>
            <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
              • GPS Radar Synced
            </span>
          </div>

          <div className="ff-page-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 className="ff-page-title">Store Configuration</h1>
                <span className="ff-admin-badge">STR-305</span>
                <span className="ff-status-pill ff-status-active">• Active Depot</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                Colombo 01 (Western Hub) • Port Access Gate 04 • High Capacity Ingestion Node
              </div>
            </div>

            <div className="ff-header-actions">
              <button className="ff-btn-secondary"><Download size={15} /> Export Specs</button>
              <button className="ff-btn-secondary" onClick={() => onNavigate && onNavigate('schedules')}><Calendar size={15} /> Bay Schedule</button>
              <button className="ff-btn-secondary" style={{ background: '#f1f5f9' }}>Discard</button>
              <button className="ff-btn-primary"><Save size={15} /> Save Changes</button>
            </div>
          </div>

          <div className="ff-kpi-grid">
            <div className="ff-kpi-card">
              <div>
                <div className="ff-kpi-label">INTAKE CAPACITY</div>
                <div className="ff-kpi-value">4 Bays Active</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>3 Live Docks, 1 Maintenance</div>
              </div>
              <div className="ff-kpi-icon-box" style={{ background: '#f8fafc', color: '#245a4f' }}>
                <Store size={19} />
              </div>
            </div>

            <div className="ff-kpi-card">
              <div>
                <div className="ff-kpi-label">OPERATIONAL ROSTER</div>
                <div className="ff-kpi-value">24 Hours</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>2 Continuous Shifts</div>
              </div>
              <div className="ff-kpi-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <Clock size={19} />
              </div>
            </div>

            <div className="ff-kpi-card">
              <div>
                <div className="ff-kpi-label">RADAR & GEOFENCE</div>
                <div className="ff-kpi-value">140ms Synced</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Live Perimeter Telemetry</div>
              </div>
              <div className="ff-kpi-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
                <Radio size={19} />
              </div>
            </div>

            <div className="ff-kpi-card">
              <div>
                <div className="ff-kpi-label">SCHEDULED INTAKE</div>
                <div className="ff-kpi-value">18 Trucks / Day</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>92% Utilization</div>
              </div>
              <div className="ff-kpi-icon-box" style={{ background: '#f0fdfa', color: '#0d9488' }}>
                <Truck size={19} />
              </div>
            </div>
          </div>

          <div className="ff-cfg-grid">
            <div className="ff-cfg-col">
              <div className="ff-card">
                <div className="ff-card-header">
                  <div>
                    <div className="ff-card-title">
                      <MapPin size={17} color="#059669" /> Store Identity & Geofence Perimeter
                    </div>
                    <div className="ff-card-sub">Terminal configuration, hardware telemetry & proximity triggers</div>
                  </div>
                </div>

                <div className="ff-form-grid">
                  <div>
                    <label className="ff-field-label">Store ID / Node Code</label>
                    <input className="ff-input" defaultValue="STR-305" readOnly />
                  </div>
                  <div>
                    <label className="ff-field-label">Facility Full Legal Name</label>
                    <input className="ff-input" defaultValue="Colombo Central Hub (CDC)" />
                  </div>
                  <div>
                    <label className="ff-field-label">Facility Classification</label>
                    <input className="ff-input" defaultValue="Central Distribution Center" />
                  </div>
                  <div>
                    <label className="ff-field-label">Gate / Approach Terminal</label>
                    <input className="ff-input" defaultValue="Port Access Gate 04, Colombo 01" />
                  </div>
                </div>

                <div className="ff-radar-box">
                  <div className="ff-radar-top">
                    <span style={{ fontFamily: 'monospace', color: '#34d399' }}>6.9344° N, 79.8428° E</span>
                    <span style={{ background: '#1b3b34', color: '#6ee7b7', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                      Active Buffer: {activeBuffer}
                    </span>
                  </div>
                  <div className="ff-radar-canvas">
                    <span className="ff-radar-tag" style={{ top: '14px', right: '20px' }}>BK-8849 (ETA 08m)</span>
                    <div className="ff-radar-center">
                      <Store size={14} color="#34d399" />
                      <span>CDC #305</span>
                    </div>
                    <span className="ff-radar-tag" style={{ bottom: '14px', left: '20px' }}>BK-8837 (ETA 14m)</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'right', marginTop: '8px' }}>
                    • Gate 04 Automated RFID Scanner: Online
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="ff-field-label" style={{ margin: 0 }}>Geofence Detection Sensitivity Buffer</label>
                    <span style={{ background: '#245a4f', color: 'white', fontSize: '11px', padding: '2px 10px', borderRadius: '12px', fontWeight: 700 }}>
                      {activeBuffer} meters
                    </span>
                  </div>

                  <div className="ff-buffer-grid">
                    <div
                      className={`ff-buffer-card ${activeBuffer === '100m' ? 'active' : ''}`}
                      onClick={() => setActiveBuffer('100m')}
                    >
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>100m</div>
                      <div style={{ fontSize: '11px', opacity: 0.8 }}>Strict Yard</div>
                    </div>
                    <div
                      className={`ff-buffer-card ${activeBuffer === '250m' ? 'active' : ''}`}
                      onClick={() => setActiveBuffer('250m')}
                    >
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>250m</div>
                      <div style={{ fontSize: '11px', opacity: 0.8 }}>Optimal Inner Perimeter</div>
                    </div>
                    <div
                      className={`ff-buffer-card ${activeBuffer === '600m' ? 'active' : ''}`}
                      onClick={() => setActiveBuffer('600m')}
                    >
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>600m</div>
                      <div style={{ fontSize: '11px', opacity: 0.8 }}>Expressway Approach</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '11px', color: '#64748b' }}>
                    Vehicles entering this geofence buffer automatically trigger gate manifest pre-clearance and notify dock supervisors.
                  </p>
                </div>
              </div>

              <div className="ff-card">
                <div className="ff-card-header">
                  <div>
                    <div className="ff-card-title">Ingestion Bays & Equipment Rules</div>
                    <div className="ff-card-sub">Manage active terminals, payload constraints and dock capacities</div>
                  </div>
                  <button className="ff-btn-secondary">
                    <Plus size={14} /> Add New Bay Profile
                  </button>
                </div>

                <div className="ff-bay-card">
                  <div className="ff-bay-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '13px' }}>Bay 01 — Heavy Intake</strong>
                      <span className="ff-status-pill ff-status-active">Active Dock</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                      <span>Hydraulic Ramp</span>
                      <button className={`ff-switch ${hydraulicRamp ? 'on' : ''}`} onClick={() => setHydraulicRamp(!hydraulicRamp)}>
                        <span className="ff-switch-knob"></span>
                      </button>
                    </div>
                  </div>
                  <div className="ff-bay-specs">
                    <div>
                      <div className="ff-field-label">MAX PAYLOAD</div>
                      <strong>35 Metric Tons</strong>
                    </div>
                    <div>
                      <div className="ff-field-label">PRIMARY CARRIER ROSTER</div>
                      <strong>Western Logistics, DIMO Express</strong>
                    </div>
                    <div>
                      <div className="ff-field-label">TYPICAL UNLOAD PACE</div>
                      <strong>≈ 40 mins avg.</strong>
                    </div>
                  </div>
                </div>

                <div className="ff-bay-card">
                  <div className="ff-bay-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '13px' }}>Bay 02 — Chilled Goods Dock</strong>
                      <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '11px', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
                        Chilled Dock
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                      <span>Pre-cool Enforced</span>
                      <button className={`ff-switch ${preCool ? 'on' : ''}`} onClick={() => setPreCool(!preCool)}>
                        <span className="ff-switch-knob"></span>
                      </button>
                    </div>
                  </div>
                  <div className="ff-bay-specs">
                    <div>
                      <div className="ff-field-label">TARGET COLD ZONE</div>
                      <strong>2°C to 6°C Active</strong>
                    </div>
                    <div>
                      <div className="ff-field-label">ALLOCATED ACCOUNTS</div>
                      <strong>Highland Dairies, Elephant House</strong>
                    </div>
                    <div>
                      <div className="ff-field-label">DOCK ISOLATION GATE</div>
                      <strong style={{ color: '#059669' }}>Pneumatic Seal Active</strong>
                    </div>
                  </div>
                </div>

                <div className="ff-bay-card">
                  <div className="ff-bay-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '13px' }}>Bay 03 — FMCG Rapid Dock</strong>
                      <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '11px', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
                        High Cadence
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                      <span>Express Turnaround</span>
                      <button className={`ff-switch ${expressTurn ? 'on' : ''}`} onClick={() => setExpressTurn(!expressTurn)}>
                        <span className="ff-switch-knob"></span>
                      </button>
                    </div>
                  </div>
                  <div className="ff-bay-specs">
                    <div>
                      <div className="ff-field-label">MAX DWELL WINDOW</div>
                      <strong>45 Minutes Strict</strong>
                    </div>
                    <div>
                      <div className="ff-field-label">ASSIGNED CONSIGNEES</div>
                      <strong>Unilever SL., Nestlé Lanka</strong>
                    </div>
                    <div>
                      <div className="ff-field-label">STAGING AREA</div>
                      <strong>Pallet Lane 3A</strong>
                    </div>
                  </div>
                </div>

                <div className="ff-bay-card offline" style={{ marginBottom: 0 }}>
                  <div className="ff-bay-top" style={{ borderColor: '#fecdd3' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#be123c' }}>Bay 04 — Reverse Logistics & Returns</strong>
                      <span className="ff-status-pill ff-status-maint">Maintenance / Offline</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                      <span>Bay Operational</span>
                      <button className={`ff-switch ${bayOperational ? 'on' : ''}`} onClick={() => setBayOperational(!bayOperational)}>
                        <span className="ff-switch-knob"></span>
                      </button>
                    </div>
                  </div>

                  <div style={{ background: '#ffe4e6', border: '1px solid #fecdd3', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#9f1239', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Wrench size={15} />
                    <span><strong>Hydraulic Ramp Service in Progress</strong> • 11:00 AM – 14:00 PM • Authorized Tech: Lanka Lift Ltd</span>
                  </div>

                  <div className="ff-bay-specs">
                    <div>
                      <div className="ff-field-label">ASSIGNED PURPOSE</div>
                      <strong>Return Crates & Pallet Intake</strong>
                    </div>
                    <div>
                      <div className="ff-field-label">SERVICE WINDOW</div>
                      <strong>Scheduled until 14:00 Today</strong>
                    </div>
                    <div>
                      <div className="ff-field-label">RAMP DIAGNOSTIC</div>
                      <strong>Pneumatic Seals Replaced</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ff-cfg-col">
              <div className="ff-card">
                <div className="ff-card-header">
                  <div>
                    <div className="ff-card-title">Scheduling Constraints</div>
                    <div className="ff-card-sub">Ingestion SLAs & capacity guards</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                  <div>
                    <label className="ff-field-label">Standard Intake Window</label>
                    <select className="ff-input">
                      <option>60 Minutes</option>
                      <option>45 Minutes</option>
                      <option>30 Minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="ff-field-label">Max Yard Simultaneous Carriers</label>
                    <select className="ff-input">
                      <option>6 Carriers</option>
                      <option>8 Carriers</option>
                      <option>10 Carriers</option>
                    </select>
                  </div>

                  <div>
                    <label className="ff-field-label">Dock Sanitation & Prep Buffer</label>
                    <select className="ff-input">
                      <option>15 Minutes</option>
                      <option>10 Minutes</option>
                      <option>20 Minutes</option>
                    </select>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>Auto-Conflict Prevention</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Automatically shift overlapping bay bookings to open adjacent docks.
                      </div>
                    </div>
                    <button className={`ff-switch ${autoConflict ? 'on' : ''}`} onClick={() => setAutoConflict(!autoConflict)}>
                      <span className="ff-switch-knob"></span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>Overstay Penalty Alert</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Trigger priority incident alert when vehicle exceeds dwell window by &gt;15 mins.
                      </div>
                    </div>
                    <button className={`ff-switch ${overstayAlert ? 'on' : ''}`} onClick={() => setOverstayAlert(!overstayAlert)}>
                      <span className="ff-switch-knob"></span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="ff-card">
                <div className="ff-card-header">
                  <div>
                    <div className="ff-card-title">Depot Duty Personnel</div>
                    <div className="ff-card-sub">Designated operational escalation contacts</div>
                  </div>
                </div>

                <div className="ff-person-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="ff-avatar">KP</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>Kavinda Perera</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>+94 11 249 9000</div>
                    </div>
                  </div>
                  <span className="ff-status-pill ff-status-active" style={{ fontSize: '11px' }}>Primary On-Call</span>
                </div>

                <div className="ff-person-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="ff-avatar" style={{ background: '#e2e8f0', color: '#334155' }}>KH</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>Kasun Herath</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>+94 77 124 9901</div>
                    </div>
                  </div>
                  <span className="ff-admin-badge">Backup</span>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', color: '#475569', marginTop: '8px' }}>
                  <strong>Automated Escalation:</strong> Dispatch direct SMS & in-app alerts to supervisor on duty if bay dwell time exceeds threshold.
                </div>
              </div>

              <div className="ff-security-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px', color: '#064e3b' }}>
                    <ShieldCheck size={18} color="#059669" />
                    <span>Yard Security Clearance</span>
                  </div>
                  <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '12px' }}>
                    • SLPA Live
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: '#166534', lineHeight: '1.5', marginBottom: '16px' }}>
                  All arriving transport units must possess pre-cleared digital gate manifests validated against Sri Lanka Ports Authority (SLPA) terminal registry before physical barrier release.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #bbf7d0', fontSize: '11px' }}>
                  <div>
                    <div style={{ color: '#15803d' }}>Registry Hash:</div>
                    <strong style={{ fontFamily: 'monospace', color: '#064e3b' }}>#e48f2...831a</strong>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View Yard Protocol <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="ff-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ color: '#059669', fontWeight: 600 }}>• Systems Operational</span>
            <span>Store ID: STR-305</span>
            <span>Node Revision: v4.82-stable</span>
            <span>© 2026 FleetFlow Logistics Cloud</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Help Center</span>
            <span>Privacy Policy</span>
            <span>Terms</span>
          </div>
        </footer>
      </div>
    </div>
  );
}