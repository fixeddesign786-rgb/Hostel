import React from 'react';
import { Phone, Mail, MapPin, Shield, AlertTriangle, ArrowRight } from 'lucide-react';
import { HostelSettings } from '../types.ts';

interface FooterProps {
  onNavigate: (tab: string) => void;
  settings: HostelSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings }) => {
  const phone = settings?.phone || '+92 300 1234567';
  const whatsapp = settings?.whatsapp || '+92 300 1234567';
  const email = settings?.email || 'info@hostelportal.pk';
  const address = settings?.complete_address || 'Plot 48, Street 14, Service Road South, Sector H-12 / I-9';
  const city = settings?.city || 'Islamabad';
  const country = settings?.country || 'Pakistan';

  return (
    <footer className="bg-[#0B192C] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg text-emerald-400">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">
                  {settings?.hostel_name || 'HOSTEL'}
                </span>
                <span className="block text-[10px] tracking-widest text-emerald-400 font-bold">
                  {settings?.tagline || 'STAY • STUDY • GROW'}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Safe, modern and hygienic student accommodation with 24/7 electricity backup, filtered
              RO water, nutritious Pakistani mess, dedicated study rooms, high-speed Wi-Fi, and
              strict security.
            </p>

            {/* Quick emergency status box */}
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-emerald-400" />
                <div className="text-xs">
                  <div className="font-bold text-white">Safe & Registered Premises</div>
                  <div className="text-slate-400 text-[11px]">Local Police Station Liaison Active</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('emergency')}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 underline"
              >
                Emergency SOS
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition">
                  About Hostel
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rooms')} className="hover:text-emerald-400 transition">
                  Rooms & Rates
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('facilities')} className="hover:text-emerald-400 transition">
                  Hostel Facilities
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('food')} className="hover:text-emerald-400 transition">
                  Mess & Food Menu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-emerald-400 transition">
                  Photo Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resident & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Resident & Safety</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('book')} className="hover:text-emerald-400 transition font-medium text-emerald-400 flex items-center gap-1">
                  Book a Room Online <ArrowRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('complaints')} className="hover:text-emerald-400 transition">
                  Submit Complaint
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('emergency')} className="hover:text-rose-400 transition text-rose-300">
                  Emergency Helpdesk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-emerald-400 transition">
                  Hostel Rules & Policies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-panel')} className="hover:text-blue-400 transition text-xs opacity-75">
                  Staff Admin Login
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hostel Location</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {address}, {city}, {country}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-xs">WhatsApp: {whatsapp}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white truncate">
                  {email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} {settings?.hostel_name || 'Al-Madina Executive Hostel'}. All
            rights reserved. Designed for Pakistani hostel living.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('policies')} className="hover:text-slate-300">
              Hostel Rules
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('emergency')} className="hover:text-slate-300">
              Police & Rescue Liaison
            </button>
            <span>•</span>
            <span className="text-emerald-500 font-medium">Demo Data Mode</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
