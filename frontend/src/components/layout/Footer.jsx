import React from 'react';
import { 
  Truck, 
  Compass, 
  LayoutGrid, 
  ShieldCheck, 
  HelpCircle, 
  Mail, 
  Lock, 
  FileText, 
  LogIn, 
  UserPlus, 
  Store 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1b3b34] text-[#a3c1ad] font-sans pt-16 pb-8 px-6 md:px-16 border-t border-[#2a4d44]">
      
      {/* Top Main Columns Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        
        {/* Column 1: Brand & Operational Status */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#244e45] flex items-center justify-center text-white border border-[#35685c]">
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold tracking-wide text-white">
              FleetFlow
            </h2>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed pr-4">
            Simplifying fleet operations, store scheduling and delivery coordination.
          </p>
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#112924] border border-[#265349] text-xs text-gray-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All Cloud Logistics Systems Operational</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-300 mb-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Quick Links</span>
          </div>
          <ul className="space-y-2.5 text-xs text-gray-300">
            <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#howitworks" className="hover:text-white transition-colors">How It Works</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Platform */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-300 mb-2">
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
            <span>Platform</span>
          </div>
          <ul className="space-y-2.5 text-xs text-gray-300">
            <li>
              <a href="#signin" className="flex items-center gap-2 hover:text-white transition-colors">
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign In</span>
              </a>
            </li>
            <li>
              <a href="#signup" className="flex items-center gap-2 hover:text-white transition-colors">
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign Up</span>
              </a>
            </li>
            <li>
              <a href="#storeportal" className="flex items-center justify-between hover:text-white transition-colors bg-[#16302a] px-3 py-1.5 rounded-lg border border-[#2b584d]">
                <span className="flex items-center gap-2">
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Store Portal</span>
                </span>
                <span className="text-[10px] bg-[#22473e] text-emerald-300 px-2 py-0.5 rounded font-mono">Portal App</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Support & Legal */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-300 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Support & Legal</span>
          </div>
          <ul className="space-y-2.5 text-xs text-gray-300">
            <li>
              <a href="#help" className="flex items-center gap-2 hover:text-white transition-colors">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Help Center</span>
              </a>
            </li>
            <li>
              <a href="#support" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contact Support</span>
              </a>
            </li>
            <li>
              <a href="#privacy" className="flex items-center gap-2 hover:text-white transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privacy Policy</span>
              </a>
            </li>
            <li>
              <a href="#terms" className="flex items-center gap-2 hover:text-white transition-colors">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Terms of Service</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright & Security Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[#264e44] flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <p>© 2026 FleetFlow. All rights reserved.</p>
        
        <div className="flex items-center gap-3">
          <div className="bg-[#142e28] border border-[#255247] px-3.5 py-1.5 rounded-lg text-emerald-300 text-[11px] font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>ENTERPRISE LOGISTICS CLOUD PLATFORM</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>256-bit TLS Encrypted</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;