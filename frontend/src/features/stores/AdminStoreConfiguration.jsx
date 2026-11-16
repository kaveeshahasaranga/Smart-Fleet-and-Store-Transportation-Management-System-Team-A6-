import React, { useState } from 'react';
import { 
  Truck, 
  LayoutDashboard, 
  Calendar, 
  Store, 
  Route, 
  Sliders, 
  Clock, 
  Search, 
  HelpCircle, 
  Bell, 
  Download, 
  Save, 
  ShieldCheck, 
  MapPin, 
  Wrench, 
  Radio, 
  Plus, 
  User, 
  AlertTriangle,
  FileText,
  ExternalLink
} from 'lucide-react';

const AdminStoreConfiguration = () => {
  const [autoConflict, setAutoConflict] = useState(true);
  const [overstayAlert, setOverstayAlert] = useState(true);
  const [hydraulicRamp, setHydraulicRamp] = useState(true);
  const [preCool, setPreCool] = useState(true);
  const [expressTurn, setExpressTurn] = useState(true);
  const [bayOperational, setBayOperational] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans flex flex-col">
      
      {/* 1. TOP HEADER BAR */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1b3b34] flex items-center justify-center text-white shadow-sm">
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wide text-[#1b3b34]">FleetFlow</span>
              <span className="text-[10px] bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded border border-gray-200 uppercase">ADMIN</span>
            </div>
            <p className="text-[11px] text-gray-500 tracking-wider">LOGISTICS CLOUD</p>
          </div>
        </div>

        {/* Search & Profile */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search fleet, stores, runs..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#1b3b34]"
            />
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><HelpCircle className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-800">Kavinda Perera</p>
                <p className="text-[10px] text-gray-500">Ops Supervisor</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1b3b34] text-white flex items-center justify-center font-bold text-xs">
                KP
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER (Sidebar + Content) */}
      <div className="flex flex-1">
        
        {/* 2. SIDEBAR */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden lg:flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase px-3 mb-2">OPERATIONS</p>
              <nav className="space-y-1">
                <a href="#overview" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <LayoutDashboard className="w-4 h-4 text-gray-400" />
                  <span>Overview</span>
                </a>
                <a href="#bookings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Bookings</span>
                </a>
                <a href="#vehicles" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <Truck className="w-4 h-4 text-gray-400" />
                  <span>Vehicles</span>
                </a>
                <a href="#stores" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <Store className="w-4 h-4 text-gray-400" />
                  <span>Stores</span>
                </a>
                <a href="#trips" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <Route className="w-4 h-4 text-gray-400" />
                  <span>Trips</span>
                </a>
                <a href="#config" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-[#1b3b34] shadow-sm">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Store Configuration</span>
                </a>
                <a href="#schedules" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Store Schedules</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Active Depot Footer Widget inside sidebar */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 text-[#1b3b34]" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ACTIVE DEPOT</p>
                <p className="text-xs font-bold text-gray-800">Colombo Central Hub</p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </aside>

        {/* 3. MAIN CONTENT AREA */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-auto">
          
          {/* Breadcrumb & Top Config Action Header */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-gray-400 mb-1">Stores / Colombo Central Hub (CDC) / Configuration</p>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Store Configuration</h1>
                <span className="font-mono text-xs bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded border border-gray-200">STR-305</span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Active Depot</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                <span>Colombo 01 (Western Hub)</span>
                <span>•</span>
                <span>Port Access Gate 04</span>
                <span>•</span>
                <span>High Capacity Ingestion Node</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors">
                <Download className="w-3.5 h-3.5" />
                <span>Export Specs</span>
              </button>
              <button className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors">
                <Calendar className="w-3.5 h-3.5" />
                <span>Bay Schedule</span>
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors">
                Discard
              </button>
              <button className="flex items-center gap-1.5 bg-[#1b3b34] hover:bg-[#142e28] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors">
                <Save className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* TOP METRICS SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">INTAKE CAPACITY</p>
              <div className="flex items-center justify-between mt-1">
                <h3 className="text-xl font-bold text-gray-900">4 Bays Active</h3>
                <Store className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">3 Live Docks, 1 Maintenance</p>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">OPERATIONAL ROSTER</p>
              <div className="flex items-center justify-between mt-1">
                <h3 className="text-xl font-bold text-gray-900">24 Hours</h3>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">2 Continuous Shifts</p>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">RADAR & GEOFENCE</p>
              <div className="flex items-center justify-between mt-1">
                <h3 className="text-xl font-bold text-gray-900">140ms Synced</h3>
                <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Live Perimeter Telemetry</p>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SCHEDULED INTAKE</p>
              <div className="flex items-center justify-between mt-1">
                <h3 className="text-xl font-bold text-gray-900">18 Trucks / Day</h3>
                <Truck className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">92% Utilization</p>
            </div>
          </div>

          {/* TWO COLUMN CONFIGURATION LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT 2 COLUMNS: Identity, Geofence, Bays */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* STORE IDENTITY & GEOFENCE PERIMETER */}
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Store Identity & Geofence Perimeter</h2>
                  </div>
                  <span className="text-[11px] text-gray-400">Terminal configuration, hardware telemetry & proximity triggers</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Store ID / Node Code</label>
                    <input 
                      type="text" 
                      defaultValue="STR-305" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-800 focus:outline-none focus:border-[#1b3b34]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Facility Full Legal Name</label>
                    <input 
                      type="text" 
                      defaultValue="Colombo Central Hub (CDC)" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#1b3b34]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Facility Classification</label>
                    <input 
                      type="text" 
                      defaultValue="Central Distribution Center" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#1b3b34]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Gate / Approach Terminal</label>
                    <input 
                      type="text" 
                      defaultValue="Port Access Gate 04, Colombo 01" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#1b3b34]"
                    />
                  </div>
                </div>

                {/* Radar Mock Box */}
                <div className="bg-[#112924] border border-[#244e45] rounded-xl p-4 text-white relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-mono text-emerald-400">6.9344° N, 79.8428° E</span>
                    <span className="bg-[#1b3b34] text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#2e5c51]">Active Buffer: 250m</span>
                  </div>
                  <div className="h-28 flex items-center justify-center relative border border-dashed border-[#265349] rounded-lg">
                    <div className="absolute w-16 h-16 rounded-full border border-emerald-500/30 animate-ping" />
                    <div className="w-10 h-10 rounded-full bg-[#1b3b34] border border-emerald-500 flex items-center justify-center text-xs font-bold z-10">
                      CDC #305
                    </div>
                    <span className="absolute top-3 left-4 text-[10px] text-emerald-400 bg-[#16302a] px-2 py-0.5 rounded border border-[#2b584d]">BK-8837 (ETA 14m)</span>
                    <span className="absolute bottom-3 right-4 text-[10px] text-emerald-400 bg-[#16302a] px-2 py-0.5 rounded border border-[#2b584d]">BK-8849 (ETA 08m)</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 text-right">Gate 04 Accessed RFID Scanner: Online</p>
                </div>

                {/* Geofence Sensitivity Buffer */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-gray-700 uppercase">Geofence Detection Sensitivity Buffer</label>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-center cursor-pointer hover:bg-gray-100">
                      <p className="font-bold text-gray-800">100m</p>
                      <p className="text-[10px] text-gray-500">Strict Yard</p>
                    </div>
                    <div className="bg-[#1b3b34] text-white border border-[#1b3b34] p-2.5 rounded-lg text-center cursor-pointer shadow-sm">
                      <p className="font-bold text-emerald-300">250m</p>
                      <p className="text-[10px] text-emerald-100">Optimal Inner Perimeter</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-center cursor-pointer hover:bg-gray-100">
                      <p className="font-bold text-gray-800">600m</p>
                      <p className="text-[10px] text-gray-500">Expressway Approach</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 italic mt-1">Vehicles entering this geofence buffer automatically trigger gate manifest pre-clearance and notify dock supervisors.</p>
                </div>

              </div>

              {/* INGESTION BAYS & EQUIPMENT RULES */}
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Ingestion Bays & Equipment Rules</h2>
                    <p className="text-[11px] text-gray-500">Manage active terminals, payload constraints and dark reputation</p>
                  </div>
                  <button className="flex items-center gap-1 bg-[#1b3b34] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm hover:bg-[#142e28] transition-colors">
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Add New Bay Profile</span>
                  </button>
                </div>

                {/* BAY 01 */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">Bay 01 — Heavy Intake</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Active Dock</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <span>Hydraulic Ramp</span>
                      <button 
                        onClick={() => setHydraulicRamp(!hydraulicRamp)}
                        className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${hydraulicRamp ? 'bg-[#1b3b34]' : 'bg-gray-300'}`}
                      >
                        <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${hydraulicRamp ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2 border-t border-gray-200">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">MAX PAYLOAD</p>
                      <p className="font-bold text-gray-800 mt-0.5">31 Metric Tons</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">PRIMARY CARRIER ROSTER</p>
                      <p className="font-bold text-gray-800 mt-0.5">Western Logistics, DIMO Express</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">TYPICAL UNLOAD PACE</p>
                      <p className="font-bold text-gray-800 mt-0.5">≈ 40 mins avg.</p>
                    </div>
                  </div>
                </div>

                {/* BAY 02 */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">Bay 02 — Chilled Goods Dock</span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">Chilled Dock</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <span>Pre-cool Enforced</span>
                      <button 
                        onClick={() => setPreCool(!preCool)}
                        className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${preCool ? 'bg-[#1b3b34]' : 'bg-gray-300'}`}
                      >
                        <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${preCool ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2 border-t border-gray-200">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">TARGET COLD ZONE</p>
                      <p className="font-bold text-gray-800 mt-0.5">2°C to 6°C Active</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">ALLOCATED ACCOUNTS</p>
                      <p className="font-bold text-gray-800 mt-0.5">Highland Dairies, Elephant House</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">DOCK ISOLATION GATE</p>
                      <p className="font-bold text-emerald-700 mt-0.5">Pneumatic Seal Active</p>
                    </div>
                  </div>
                </div>

                {/* BAY 03 */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">Bay 03 — FMCG Rapid Dock</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">High Cadence</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <span>Express Turnaround</span>
                      <button 
                        onClick={() => setExpressTurn(!expressTurn)}
                        className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${expressTurn ? 'bg-[#1b3b34]' : 'bg-gray-300'}`}
                      >
                        <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${expressTurn ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2 border-t border-gray-200">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">MAX DWELL WINDOW</p>
                      <p className="font-bold text-gray-800 mt-0.5">45 Minutes Strict</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">ASSIGNED CONSIGNEES</p>
                      <p className="font-bold text-gray-800 mt-0.5">Unilever SL., Nestlé Lanka</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">STAGING AREA</p>
                      <p className="font-bold text-gray-800 mt-0.5">Pallet Lane 3A</p>
                    </div>
                  </div>
                </div>

                {/* BAY 04 (Maintenance / Offline) */}
                <div className="border border-rose-200 rounded-xl p-4 bg-rose-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-rose-700">Bay 04 — Reverse Logistics & Returns</span>
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">Maintenance / Offline</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <span>Bay Operational</span>
                      <button 
                        onClick={() => setBayOperational(!bayOperational)}
                        className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${bayOperational ? 'bg-[#1b3b34]' : 'bg-gray-300'}`}
                      >
                        <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${bayOperational ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Warning Maintenance Banner */}
                  <div className="bg-rose-100/60 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-900 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-rose-600 shrink-0" />
                    <span><strong>Hydraulic Ramp Service in Progress</strong> • 11:00 AM – 14:00 PM • Authorized Body: Lanka Lift Ltd</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">ASSIGNED PURPOSE</p>
                      <p className="font-bold text-gray-800 mt-0.5">Return Crates & Pallet Intake</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">SERVICE WINDOW</p>
                      <p className="font-bold text-gray-800 mt-0.5">Scheduled until 14:00 Today</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">RAMP DIAGNOSTIC</p>
                      <p className="font-bold text-gray-800 mt-0.5">Pneumatic Seals Replaced</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Scheduling Constraints, Personnel, Security */}
            <div className="space-y-6">
              
              {/* SCHEDULING CONSTRAINTS */}
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Scheduling Constraints</h2>
                  <p className="text-[11px] text-gray-500">Ingestion SLAs & capacity guards</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Standard Intake Window</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none">
                      <option>60 Minutes</option>
                      <option>45 Minutes</option>
                      <option>30 Minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Max Yard Simultaneous Carriers</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none">
                      <option>6 Carriers</option>
                      <option>8 Carriers</option>
                      <option>10 Carriers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Dock Sanitation & Prep Buffer</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none">
                      <option>15 Minutes</option>
                      <option>10 Minutes</option>
                      <option>20 Minutes</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">Auto-Conflict Prevention</p>
                      <p className="text-[10px] text-gray-500">Automatically shift overlapping bay bookings to open adjacent docks.</p>
                    </div>
                    <button 
                      onClick={() => setAutoConflict(!autoConflict)}
                      className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors shrink-0 ${autoConflict ? 'bg-[#1b3b34]' : 'bg-gray-300'}`}
                    >
                      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${autoConflict ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="font-bold text-gray-900">Overstay Penalty Alert</p>
                      <p className="text-[10px] text-gray-500">Trigger priority incident alert when vehicle exceeds dwell window by &gt;15 mins.</p>
                    </div>
                    <button 
                      onClick={() => setOverstayAlert(!overstayAlert)}
                      className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors shrink-0 ${overstayAlert ? 'bg-[#1b3b34]' : 'bg-gray-300'}`}
                    >
                      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${overstayAlert ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* DEPOT DUTY PERSONNEL */}
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Depot Duty Personnel</h2>
                  <p className="text-[11px] text-gray-500">Designated operational escalation contacts</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1b3b34] text-white flex items-center justify-center font-bold text-xs">
                        KP
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">Kavinda Perera</p>
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded">Primary On-Call</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">+94 11 249 9000</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs">
                        KH
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">Kasun Herath</p>
                          <span className="bg-gray-200 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded">Backup</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">+94 77 124 9901</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
                    <strong>Automated Escalation:</strong> Dispatch direct SMS & in-app alerts to supervisor on duty if dwell time exceeds threshold.
                  </p>
                </div>
              </div>

              {/* YARD SECURITY CLEARANCE */}
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Yard Security Clearance</h2>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">SLPA Live</span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  All arriving transport units must possess pre-cleared digital gate manifests validated against Sri Lanka Ports Authority (SLPA) unmuted registry before physical barrier release.
                </p>

                <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Registry Hash</p>
                    <p className="font-mono font-bold text-gray-800">9448F2...8398</p>
                  </div>
                  <a href="#protocol" className="text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                    <span>View Yard Protocol</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between mt-auto gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Systems Operational</span>
          </div>
          <span>•</span>
          <span>Store ID: STR-305</span>
          <span>•</span>
          <span>Node Revision: v4.2-stable</span>
        </div>
        <div className="flex items-center gap-4">
          <span>© 2026 FleetFlow. All rights reserved.</span>
          <div className="flex items-center gap-3 text-gray-400">
            <a href="#help" className="hover:text-gray-700">Help Center</a>
            <a href="#privacy" className="hover:text-gray-700">Privacy Policy</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default AdminStoreConfiguration;