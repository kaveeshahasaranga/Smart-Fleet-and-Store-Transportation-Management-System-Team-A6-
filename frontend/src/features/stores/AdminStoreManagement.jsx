import React, { useState } from 'react';
import { 
  Truck, 
  LayoutDashboard, 
  Calendar, 
  MapPin, 
  Store, 
  Route, 
  Sliders, 
  Clock, 
  Search, 
  Download, 
  Plus, 
  Edit, 
  MoreVertical, 
  HelpCircle, 
  Bell, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

const AdminStoreManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample store data matching the screenshot
  const storesData = [
    {
      id: 'STR-104',
      name: 'Nugegoda Super Center #104',
      address: '142 High Level Rd • Retail Hub',
      location: 'Colombo (Western)',
      coords: '6.8649° N, 79.8997° E',
      contactPerson: 'Kasun Herath',
      phone: '+94 77 124 9901',
      operatingHours: '07:00 – 21:00',
      status: 'Active',
    },
    {
      id: 'STR-218',
      name: 'Maharagama Retail Hub #218',
      address: '89 Old Rd • Delivery Point',
      location: 'Maharagama (Western)',
      coords: '6.8480° N, 79.9267° E',
      contactPerson: 'Saman Perera',
      phone: '+94 71 883 4110',
      operatingHours: '08:00 – 20:00',
      status: 'Active',
    },
    {
      id: 'STR-305',
      name: 'Colombo Central Hub (CDC)',
      address: 'Port Access Gate 04 • Central Distribution',
      location: 'Colombo 01 (Western)',
      coords: '6.9344° N, 79.8428° E',
      contactPerson: 'Kavinda Perera',
      phone: '+94 11 249 9000',
      operatingHours: '24 Hours / Shifted',
      status: 'Active Depot',
    },
    {
      id: 'STR-412',
      name: 'Kandy City Depot #312',
      address: '22 William Gopallawa Mawatha',
      location: 'Kandy City (Central)',
      coords: '7.2906° N, 80.6337° E',
      contactPerson: 'Ruwan Silva',
      phone: '+94 81 223 1099',
      operatingHours: '08:30 – 19:30',
      status: 'Maintenance',
    },
    {
      id: 'STR-508',
      name: 'Galle Fort Delivery Center #108',
      address: '54 Light House St • Southern Bay',
      location: 'Galle Fort (Southern)',
      coords: '6.0267° N, 80.2170° E',
      contactPerson: 'Chaminda Dias',
      phone: '+94 91 224 5511',
      operatingHours: '08:00 – 18:00',
      status: 'Active',
    },
  ];

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
                <a href="#stores" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-[#1b3b34] shadow-sm">
                  <Store className="w-4 h-4 text-emerald-400" />
                  <span>Stores</span>
                </a>
                <a href="#trips" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <Route className="w-4 h-4 text-gray-400" />
                  <span>Trips</span>
                </a>
                <a href="#config" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <Sliders className="w-4 h-4 text-gray-400" />
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
          
          {/* Page Title & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Stores</h1>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors">
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button className="flex items-center gap-2 bg-[#1b3b34] hover:bg-[#142e28] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors">
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Add Store</span>
              </button>
            </div>
          </div>

          {/* TOP METRICS SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TOTAL REGISTERED</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">48</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#1b3b34]">
                <Store className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ACTIVE INTAKE</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">46</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">MAINTENANCE / HOLD</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">2</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SYNC LATENCY</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">140ms</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <RefreshCw className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* TABLE FILTERS BAR */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by store name, code or location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#1b3b34]"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none">
                <option>All statuses</option>
                <option>Active</option>
                <option>Maintenance</option>
              </select>
              <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none">
                <option>All Regions</option>
                <option>Western Province</option>
                <option>Central Province</option>
                <option>Southern Province</option>
              </select>
              <span className="text-xs text-gray-500 whitespace-nowrap">Showing 5 stores</span>
            </div>
          </div>

          {/* STORES DATA TABLE */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4">STORE ID</th>
                    <th className="py-3 px-4">STORE NAME</th>
                    <th className="py-3 px-4">LOCATION</th>
                    <th className="py-3 px-4">CONTACT PERSON</th>
                    <th className="py-3 px-4">OPERATING HOURS</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {storesData.map((store, index) => (
                    <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-4 font-mono font-semibold text-gray-900">{store.id}</td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-gray-900">{store.name}</p>
                        <p className="text-[11px] text-gray-500">{store.address}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-800">{store.location}</p>
                            <p className="text-[10px] font-mono text-gray-400">{store.coords}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-800">{store.contactPerson}</p>
                        <p className="text-[11px] text-gray-500 font-mono">{store.phone}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{store.operatingHours}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {store.status === 'Active' && (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Active</span>
                          </span>
                        )}
                        {store.status === 'Active Depot' && (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Active Depot</span>
                          </span>
                        )}
                        {store.status === 'Maintenance' && (
                          <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-1 rounded-full text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>Maintenance</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 font-medium transition-colors">
                            <Edit className="w-3 h-3 text-gray-500" />
                            <span>Edit</span>
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between text-xs text-gray-500">
              <p>Showing 1 to 5 of 48 stores</p>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors">Previous</button>
                <button className="px-3 py-1 rounded bg-[#1b3b34] text-white font-bold">1</button>
                <button className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors">2</button>
                <button className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors">3</button>
                <button className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors">Next</button>
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

export default AdminStoreManagement;