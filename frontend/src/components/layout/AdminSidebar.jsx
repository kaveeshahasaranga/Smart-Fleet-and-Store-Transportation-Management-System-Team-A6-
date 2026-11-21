import React from 'react';
import { 
  Truck, 
  LayoutDashboard, 
  Calendar, 
  Store, 
  Route, 
  Network 
} from 'lucide-react';

const AdminSidebar = () => {
  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 p-6 flex flex-col justify-between font-sans shadow-sm">
      
      {/* Top Section: Logo & Admin Badge */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b3b34] flex items-center justify-center text-white shadow-sm">
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1b3b34]">
              FleetFlow
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-widest bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">
            ADMIN
          </span>
        </div>

        {/* Operations Navigation Links */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase px-3 mb-3">
            OPERATIONS
          </p>
          <nav className="space-y-1.5">
            
            <a 
              href="#overview" 
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-gray-400" />
              <span>Overview</span>
            </a>

            <a 
              href="#bookings" 
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Bookings</span>
            </a>

            {/* Active Link (Vehicles) */}
            <a 
              href="#vehicles" 
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1b3b34] shadow-sm"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Vehicles</span>
            </a>

            <a 
              href="#stores" 
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Store className="w-4 h-4 text-gray-400" />
              <span>Stores</span>
            </a>

            <a 
              href="#trips" 
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Route className="w-4 h-4 text-gray-400" />
              <span>Trips</span>
            </a>

          </nav>
        </div>
      </div>

      {/* Bottom Widget: Active Depot */}
      <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#1b3b34]">
            <Network className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Depot</p>
            <p className="text-xs font-bold text-gray-900">Colombo Central Hub</p>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

    </aside>
  );
};

export default AdminSidebar;
