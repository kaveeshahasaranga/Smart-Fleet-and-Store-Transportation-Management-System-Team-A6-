import React, { useState } from 'react';
import { Truck, User, ShoppingBag } from 'lucide-react';

const Header = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const navLinks = ['Home', 'Features', 'Booking', 'Contact', 'About'];

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100 py-3 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1b3b34] flex items-center justify-center text-white shadow-sm">
            <Truck className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1b3b34]">
            FleetFlow
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {navLinks.map((link) => {
            const isActive = activeTab === link;
            return (
              <button
                key={link}
                onClick={() => setActiveTab(link)}
                className={`relative py-2 transition-colors hover:text-[#1b3b34] ${
                  isActive ? 'text-[#1b3b34] font-semibold' : ''
                }`}
              >
                {link}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1b3b34] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4 text-gray-700">
          <button 
            aria-label="User Profile" 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
          <button 
            aria-label="Shopping Bag" 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;