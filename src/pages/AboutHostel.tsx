import React from 'react';
import { Shield, CheckCircle2, Award, Clock, Users, ArrowRight, HeartHandshake } from 'lucide-react';
import { HostelSettings } from '../types.ts';

interface AboutHostelProps {
  settings: HostelSettings | null;
  onNavigate: (tab: string) => void;
}

export const AboutHostel: React.FC<AboutHostelProps> = ({ settings, onNavigate }) => {
  const hostelName = settings?.hostel_name || 'AL-MADINA EXECUTIVE HOSTEL';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold text-xs px-3.5 py-1.5 rounded-full border border-emerald-200">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>ESTABLISHED 2018 • SECURE &amp; VERIFIED</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0F284B] tracking-tight">
          About {hostelName}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Dedicated to providing Pakistani students and young professionals with a disciplined,
          hygienic, academically focused, and secure residential experience in the heart of the city.
        </p>
      </div>

      {/* 2-Column Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="text-emerald-600 font-bold text-xs uppercase tracking-widest">
            — OUR PHILOSOPHY
          </div>
          <h2 className="text-3xl font-black text-[#0F284B] leading-tight">
            A Safe, Peaceful Sanctuary for Your Academic Journey
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Living away from home is one of the most formative stages of life. At {hostelName}, we
            ensure you never have to worry about power outages, unhygienic meals, erratic internet,
            or security risks.
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            With on-duty resident wardens, 24/7 CCTV surveillance, biometric security, dedicated
            study halls, and round-the-clock power backup via solar and diesel generators, students
            can focus completely on their education and careers.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-2xl font-black text-emerald-600 mb-1">98%</div>
              <div className="text-xs font-bold text-slate-800">Student Satisfaction</div>
              <div className="text-[11px] text-slate-500">Based on resident reviews</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-2xl font-black text-blue-600 mb-1">24/7</div>
              <div className="text-xs font-bold text-slate-800">Zero Load-Shedding</div>
              <div className="text-[11px] text-slate-500">Dual generator &amp; solar</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img
            src="/src/assets/images/hostel_exterior_1791028997189.jpg"
            alt="Exterior"
            className="rounded-2xl shadow-md w-full h-64 object-cover"
            referrerPolicy="no-referrer"
          />
          <img
            src="/src/assets/images/comfortable_room_1791029014471.jpg"
            alt="Room"
            className="rounded-2xl shadow-md w-full h-64 object-cover mt-8"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200">
        <h3 className="text-2xl font-black text-[#0F284B] text-center mb-8">
          Why Parents &amp; Students Trust Us
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg">Uncompromising Safety</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Biometric entry logs, 24/7 CCTV surveillance, night curfew enforcement at 10:00 PM,
              and direct liaison with the local police station.
            </p>
          </div>

          <div className="space-y-3 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg">Nutritious Mess Food</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Wholesome 3-time hot Pakistani meals prepared in clean stainless-steel commercial
              kitchens under strict hygienic oversight.
            </p>
          </div>

          <div className="space-y-3 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg">Academic Focus</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quiet study rooms, ergonomic desk chairs, high-speed dual-band fiber internet, and
              strict observance of study hours after 11:00 PM.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('rooms')}
          className="inline-flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition"
        >
          <span>Explore Available Rooms</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
