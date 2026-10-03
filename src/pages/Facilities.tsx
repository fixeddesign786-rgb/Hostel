import React from 'react';
import { Facility } from '../types.ts';
import { FacilityCard } from '../components/FacilityCard.tsx';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface FacilitiesProps {
  facilities: Facility[];
  onNavigate: (tab: string) => void;
}

export const Facilities: React.FC<FacilitiesProps> = ({ facilities, onNavigate }) => {
  const enabledFacilities = facilities.filter((f) => f.is_enabled);

  const categories = Array.from(new Set(enabledFacilities.map((f) => f.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold text-xs px-3.5 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>ALL-INCLUSIVE RESIDENTIAL AMENITIES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F284B] tracking-tight">
          Hostel Facilities &amp; Services
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Every facility is actively managed by on-site operations staff and monitored 24/7 to ensure
          uninterrupted comfort and academic focus.
        </p>
      </div>

      {/* Facilities Strip Grid */}
      <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 text-center">
          Featured Facility Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {enabledFacilities.map((fac) => (
            <FacilityCard key={fac.id} facility={fac} />
          ))}
        </div>
      </div>

      {/* Categorized Detailed Breakdown */}
      <div className="space-y-8">
        <h2 className="text-2xl font-black text-[#0F284B] tracking-tight border-b border-slate-200 pb-3">
          Detailed Service Specifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enabledFacilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs transition"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-bold text-slate-900 text-base">{fac.name}</h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {fac.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{fac.description}</p>
              <div className="text-[11px] font-semibold text-[#1B62CD] flex items-center gap-1.5 bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Standard Feature: {fac.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-[#0F284B] to-[#1B62CD] text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Need a customized room requirement?</h3>
          <p className="text-xs text-slate-200 mt-1">
            Contact our resident admissions team to inspect rooms in person or reserve a spot.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('book')}
            className="bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-sm"
          >
            Book Room Online
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-5 py-3 rounded-xl transition border border-white/20"
          >
            Contact Warden
          </button>
        </div>
      </div>
    </div>
  );
};
