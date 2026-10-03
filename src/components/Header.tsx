import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Calendar,
  Menu,
  X,
  Shield,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Building,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { HostelSettings, UserRole } from '../types.ts';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  settings: HostelSettings | null;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, settings }) => {
  const { user, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const phone = settings?.phone || '+92 300 1234567';
  const whatsapp = settings?.whatsapp || '+92 300 1234567';
  const email = settings?.email || 'info@hostelportal.pk';

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Hostel' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'food', label: 'Food' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'policies', label: 'Hostel Policies' },
    { id: 'book', label: 'Book a Room' },
    { id: 'complaints', label: 'Complaints' },
    { id: 'emergency', label: 'Emergency' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Contact Bar matching approved reference */}
      <div className="bg-[#0B192C] text-slate-200 text-xs px-4 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left contact info */}
          <div className="flex items-center flex-wrap gap-4 sm:gap-6 font-medium">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{phone}</span>
            </a>
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>WhatsApp: {whatsapp}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="hidden md:flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>{email}</span>
            </a>
          </div>

          {/* Center tag */}
          <div className="hidden lg:block text-slate-400 font-medium tracking-wide">
            A Safe Place for Your Future • HEC & Police Registered
          </div>

          {/* Right auth & demo role switcher */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded border border-slate-700 transition"
                title="Switch demo persona for testing"
              >
                <Shield className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Role:</span>
                <span className="font-semibold text-emerald-300">
                  {user ? user.role.replace('_', ' ') : 'Guest'}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-52 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-xs"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1 font-semibold text-slate-400 border-b border-slate-100">
                    Switch Test Account
                  </div>
                  {(['STUDENT', 'HOSTEL_ADMIN', 'SUPER_ADMIN', 'SECURITY'] as UserRole[]).map(
                    (r) => (
                      <button
                        key={r}
                        onClick={() => {
                          switchRole(r);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                          user?.role === r ? 'font-bold text-emerald-600 bg-emerald-50/50' : ''
                        }`}
                      >
                        <span>{r.replace('_', ' ')}</span>
                        {user?.role === r && <span className="text-[10px] text-emerald-600">● Active</span>}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* User portal button or login */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'STUDENT' ? (
                  <button
                    onClick={() => onNavigate('resident-dashboard')}
                    className="flex items-center gap-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white px-2.5 py-1 rounded transition font-medium"
                  >
                    <UserIcon className="w-3 h-3" />
                    <span className="hidden sm:inline">Resident Portal</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('admin-panel')}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded transition font-medium"
                  >
                    <Building className="w-3 h-3" />
                    <span>Admin Panel</span>
                  </button>
                )}
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1 text-slate-400 hover:text-red-400 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-medium">
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-emerald-400 transition"
                >
                  Login
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-emerald-400 transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo matching uploaded reference */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="relative w-12 h-12 flex items-center justify-center bg-[#0F284B] rounded-lg shadow-sm text-white group-hover:scale-105 transition-transform">
              {/* House roof + open book vector */}
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
                <path
                  d="M12 15c-1.5-1-4-1-6 0v5c2-1 4.5-1 6 0 1.5-1 4-1 6 0v-5c-2-1-4.5-1-6 0z"
                  fill="#10B981"
                />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-[#0F284B] leading-none">
                HOSTEL
              </div>
              <div className="text-[10px] font-bold tracking-widest text-[#059669] uppercase mt-0.5">
                STAY • STUDY • GROW
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 text-[13px] font-medium text-slate-700">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`transition-colors py-1 relative ${
                  currentTab === link.id
                    ? 'text-emerald-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600'
                    : 'hover:text-emerald-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action: BOOK A ROOM CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onNavigate('book')}
              className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>BOOK A ROOM</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('book')}
              className="bg-[#059669] text-white text-xs font-bold px-3 py-2 rounded-md"
            >
              Book Room
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-emerald-600 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-1 py-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm rounded-md transition ${
                  currentTab === link.id
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  onNavigate(user.role === 'STUDENT' ? 'resident-dashboard' : 'admin-panel');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg"
              >
                Open {user.role === 'STUDENT' ? 'Resident Dashboard' : 'Admin Panel'}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-sm font-medium border border-slate-300 rounded-lg text-slate-700"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onNavigate('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-sm font-bold bg-[#059669] text-white rounded-lg"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
