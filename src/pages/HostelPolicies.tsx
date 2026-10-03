import React, { useState } from 'react';
import { HostelPolicy } from '../types.ts';
import { Shield, BookOpen, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

interface HostelPoliciesProps {
  policies: HostelPolicy[];
}

export const HostelPolicies: React.FC<HostelPoliciesProps> = ({ policies }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(policies.map((p) => p.category)))];

  const filteredPolicies =
    activeCategory === 'ALL'
      ? policies
      : policies.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold text-xs px-3.5 py-1.5 rounded-full border border-emerald-200">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>OFFICIAL CODE OF CONDUCT &amp; REGULATIONS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F284B] tracking-tight">
          Hostel Rules &amp; Policies
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          These guidelines are enacted to protect resident safety, academic peace, hygienic
          standards, and mutual respect among students from all across Pakistan.
        </p>
      </div>

      {/* Category selector */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeCategory === cat
                ? 'bg-[#0F284B] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Policies Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPolicies.map((pol) => (
          <div
            key={pol.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition"
          >
            <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {pol.category}
              </span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-4">{pol.title}</h3>

            <ul className="space-y-2.5">
              {pol.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Policy Acceptance Notice */}
      <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold block mb-1">Mandatory Compliance Notice</span>
          All residents and their legal guardians are required to sign and accept these hostel
          regulations at the time of admission. Violations involving violence, theft, contraband, or
          repeated curfew breaches are subject to immediate expulsion and notification to university
          administrations and local law enforcement.
        </div>
      </div>
    </div>
  );
};
