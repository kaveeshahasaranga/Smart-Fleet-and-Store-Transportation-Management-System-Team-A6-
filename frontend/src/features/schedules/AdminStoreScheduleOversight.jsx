import React from 'react';
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
  Plus, 
  Wrench, 
  Radio
} from 'lucide-react';

const AdminStoreScheduleOversight = () => {
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
                <a href="#schedules" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-[#1b3b34] shadow-sm">
                  <Clock className="w-4 h-4 text-emerald-400" />
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
          
          {/* Page Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Store Schedule Oversight</h1>
            <div className="bg-white border border-gray-200 p-1 rounded-xl flex items-center gap-2 shadow-sm">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1b3b34] text-white rounded-lg text-xs font-semibold shadow-sm">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Single Store Bay Calendar</span>
              </button>
            </div>
          </div>

          {/* BAY TRACK LEGEND & GPS SYNC BAR */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="font-bold text-gray-700 uppercase tracking-wider">BAY TRACK LEGEND:</span>
              
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-white border border-gray-300" />
                <span className="text-gray-600">Available Slot</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#1b3b34]" />
                <span className="text-gray-600">Confirmed / Reserved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
                <span className="text-gray-600">Pending Acceptance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-200" />
                <span className="text-gray-600">Maintenance / Offline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500" />
                <span className="text-gray-600">Critical Conflict</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>GPS Radar Synced: 8s ago</span>
            </div>
          </div>

          {/* TIMELINE GRID CONTAINER */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            
            {/* Timeline Header Hours */}
            <div className="bg-gray-50 border-b border-gray-200 grid grid-cols-10 text-[11px] font-bold text-gray-500 uppercase tracking-wider py-3 px-4">
              <div className="col-span-2">INTAKE BAYS (CDC)</div>
              <div className="text-center">08:00 AM</div>
              <div className="text-center">09:00 AM</div>
              <div className="text-center">10:00 AM</div>
              <div className="text-center">11:00 AM</div>
              <div className="text-center">12:00 PM</div>
              <div className="text-center">01:00 PM</div>
              <div className="text-center">02:00 PM</div>
              <div className="text-center">03:00 PM</div>
            </div>

            {/* BAYS ROWS */}
            <div className="divide-y divide-gray-200">
              
              {/* BAY 01 */}
              <div className="grid grid-cols-10 items-center p-4 gap-2">
                <div className="col-span-2">
                  <p className="font-bold text-gray-900 text-xs">Bay 01 — Heavy Intake</p>
                </div>
                <div className="col-span-8 grid grid-cols-8 gap-2 items-center text-xs">
                  {/* Slot 1: Cargills Logistics */}
                  <div className="col-span-2 bg-gray-50 border border-gray-200 p-2.5 rounded-xl relative shadow-sm">
                    <span className="absolute -top-2 right-2 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">Unloaded</span>
                    <p className="font-mono text-[10px] text-gray-500 font-semibold">BK-8831</p>
                    <p className="font-bold text-gray-900 truncate">Cargills Logistics</p>
                  </div>

                  {/* Slot 2: Available Window */}
                  <div className="col-span-2 border border-dashed border-emerald-300 bg-emerald-50/50 p-2.5 rounded-xl text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-700 font-semibold text-[11px]">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Available Window</span>
                    </div>
                    <p className="text-[10px] text-emerald-600 mt-0.5">10:00 AM – 12:00 PM</p>
                  </div>

                  {/* Slot 3: Keells Supply Chain */}
                  <div className="col-span-2 bg-[#1b3b34] text-white p-2.5 rounded-xl shadow-sm relative">
                    <span className="absolute -top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Intake Active 12:00 - 15:00</span>
                    <p className="font-mono text-[10px] text-emerald-300 font-semibold">BK-8849</p>
                    <p className="font-bold truncate">Keells Supply Chain SL</p>
                  </div>

                  {/* Slot 4: Nestlé Lanka */}
                  <div className="col-span-2 bg-gray-50 border border-gray-200 p-2.5 rounded-xl shadow-sm">
                    <p className="font-mono text-[10px] text-gray-500 font-semibold">BK-8854</p>
                    <p className="font-bold text-gray-900 truncate">Nestlé Lanka Fleet</p>
                  </div>
                </div>
              </div>

              {/* BAY 02 */}
              <div className="grid grid-cols-10 items-center p-4 gap-2">
                <div className="col-span-2">
                  <p className="font-bold text-gray-900 text-xs">Bay 02 — Chilled Goods</p>
                </div>
                <div className="col-span-8 grid grid-cols-8 gap-2 items-center text-xs">
                  <div className="col-span-1 border border-dashed border-gray-300 p-2 rounded-xl text-center text-gray-400 font-mono text-xs">
                    + 08:00
                  </div>
                  <div className="col-span-2 bg-[#1b3b34] text-white p-2.5 rounded-xl shadow-sm relative">
                    <span className="absolute -top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Chilled Dock</span>
                    <p className="font-mono text-[10px] text-emerald-300 font-semibold">BK-8837</p>
                    <p className="font-bold truncate">Highland Dairies SL</p>
                  </div>
                  <div className="col-span-2 bg-amber-50 border border-amber-200 p-2.5 rounded-xl shadow-sm">
                    <p className="font-mono text-[10px] text-amber-700 font-semibold">BK-8845</p>
                    <p className="font-bold text-gray-900 truncate">Elephant House Dairy</p>
                    <p className="text-[10px] text-amber-600 font-medium mt-0.5">Awaiting Driver</p>
                  </div>
                  <div className="col-span-3 bg-gray-50 border border-gray-200 p-2.5 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[10px] text-gray-500 font-semibold">BK-8850</p>
                      <p className="font-bold text-gray-900 truncate">Kotmale Farms Direct</p>
                    </div>
                    <Truck className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </div>
              </div>

              {/* BAY 03 (Critical Conflict) */}
              <div className="grid grid-cols-10 items-center p-4 gap-2 bg-rose-50/20">
                <div className="col-span-2">
                  <p className="font-bold text-rose-600 text-xs">Bay 03 — FMCG</p>
                  <p className="text-[10px] text-rose-500 font-semibold">Rapid Dock</p>
                </div>
                <div className="col-span-8 grid grid-cols-8 gap-2 items-center text-xs">
                  <div className="col-span-3 bg-white border border-gray-200 p-2.5 rounded-xl shadow-sm">
                    <p className="font-mono text-[10px] text-gray-500 font-semibold">BK-8833</p>
                    <p className="font-bold text-gray-900">Unilever Sri Lanka</p>
                  </div>
                  <div className="col-span-2 bg-white border border-gray-200 p-2.5 rounded-xl shadow-sm">
                    <p className="font-mono text-[10px] text-gray-500 font-semibold">BK-8846</p>
                    <p className="font-bold text-gray-900">Maliban Biscuit Mfr</p>
                  </div>
                  <div className="col-span-3 bg-[#1b3b34] text-white p-2.5 rounded-xl shadow-sm">
                    <p className="font-mono text-[10px] text-emerald-300 font-semibold">BK-8851</p>
                    <p className="font-bold truncate">Ceylon Cold Stores PLC</p>
                  </div>
                </div>
              </div>

              {/* BAY 04 (Offline / Maintenance) */}
              <div className="grid grid-cols-10 items-center p-4 gap-2">
                <div className="col-span-2">
                  <p className="font-bold text-gray-900 text-xs">Bay 04 — Reverse Logistics</p>
                </div>
                <div className="col-span-8 grid grid-cols-8 gap-2 items-center text-xs">
                  <div className="col-span-3 bg-gray-50 border border-gray-200 p-2.5 rounded-xl shadow-sm">
                    <p className="font-mono text-[10px] text-gray-500 font-semibold">BK-8835</p>
                    <p className="font-bold text-gray-900">Ceylon Beverage Dist.</p>
                  </div>
                  <div className="col-span-5 bg-slate-100 border border-slate-200 p-2.5 rounded-xl shadow-sm flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="font-bold text-xs">Hydraulic Ramp Service</p>
                        <p className="text-[10px] text-slate-500 font-mono">11:00 – 14:00</p>
                      </div>
                    </div>
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded tracking-wider">OFFLINE</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-xs text-gray-500 flex items-center justify-between mt-auto">
        <p>© 2026 FleetFlow. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Systems Operational</span>
        </div>
      </footer>

    </div>
  );
};

export default AdminStoreScheduleOversight;