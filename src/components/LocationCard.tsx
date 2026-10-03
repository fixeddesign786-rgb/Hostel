import React from 'react';
import { MapPin, Phone, MessageSquare, ExternalLink, Navigation } from 'lucide-react';
import { HostelSettings } from '../types.ts';

interface LocationCardProps {
  settings: HostelSettings | null;
}

export const LocationCard: React.FC<LocationCardProps> = ({ settings }) => {
  const hostelName = settings?.hostel_name || 'AL-MADINA EXECUTIVE HOSTEL';
  const address = settings?.complete_address || 'Plot 48, Street 14, Service Road South, Sector H-12 / I-9';
  const city = settings?.city || 'Islamabad';
  const district = settings?.district || 'Islamabad Capital Territory';
  const province = settings?.province || 'Federal Capital';
  const country = settings?.country || 'Pakistan';
  const phone = settings?.phone || '+92 300 1234567';
  const whatsapp = settings?.whatsapp || '+92 300 1234567';
  const email = settings?.email || 'info@hostelportal.pk';

  const mapQuery = encodeURIComponent(`${hostelName}, ${address}, ${city}, Pakistan`);
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div className="bg-[#0B192C] text-white p-6 sm:p-7 rounded-2xl shadow-xl border border-slate-800 flex flex-col justify-between">
      <div>
        {/* Header with location pin */}
        <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm tracking-wide">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <span>Our Location</span>
        </div>

        {/* Address Lines */}
        <div className="space-y-1 text-xs text-slate-300 mb-5">
          <div className="font-extrabold text-white text-base tracking-tight">{hostelName}</div>
          <div>{address}</div>
          <div>
            {city}, {district}, {province}
          </div>
          <div>{country}</div>
          <div className="pt-2 text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>WhatsApp: {whatsapp}</span>
            </div>
            <div className="text-slate-400">{email}</div>
          </div>
        </div>

        {/* Interactive Map Visual */}
        <div className="relative rounded-xl overflow-hidden mb-6 border border-slate-700 aspect-16/9 bg-slate-900 group">
          {/* Static styled SVG street map canvas simulating the reference image */}
          <div className="absolute inset-0 bg-[#e5e9ec] p-2 opacity-95">
            <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
              {/* Roads & rivers */}
              <path d="M0 60 Q 150 70 400 30" stroke="#ccd5dc" strokeWidth="12" />
              <path d="M50 0 L 220 200" stroke="#f6c867" strokeWidth="7" />
              <path d="M200 0 Q 180 100 350 200" stroke="#ccd5dc" strokeWidth="9" />
              <path d="M0 140 Q 200 130 400 160" stroke="#ffffff" strokeWidth="6" />
              <path d="M300 0 L 100 200" stroke="#ccd5dc" strokeWidth="5" />
              {/* City park green area */}
              <rect x="20" y="80" width="80" height="50" rx="10" fill="#c7e6c4" />
              <rect x="260" y="40" width="100" height="70" rx="12" fill="#c7e6c4" />
              {/* Red Map Pin */}
              <g transform="translate(195, 80)">
                <circle cx="12" cy="12" r="10" fill="#dc2626" opacity="0.3" className="animate-ping" />
                <path
                  d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                  fill="#dc2626"
                />
              </g>
            </svg>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-2.5 right-2.5 bg-[#0F284B] hover:bg-[#153a6d] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md transition flex items-center gap-1.5"
          >
            <span>View on Map</span>
            <ExternalLink className="w-3 h-3 text-emerald-400" />
          </a>
        </div>
      </div>

      {/* 3 Action Buttons matching reference */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-[#1B62CD] hover:bg-[#1650a8] text-white text-xs font-bold py-2.5 px-3 rounded-lg transition text-center flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions</span>
        </a>

        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold py-2.5 px-3 rounded-lg transition text-center flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Now</span>
        </a>

        <a
          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold py-2.5 px-3 rounded-lg transition text-center flex items-center justify-center gap-1.5 shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
