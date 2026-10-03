import React, { useState } from 'react';
import { FoodPlan } from '../types.ts';
import { Utensils, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

interface FoodProps {
  foodPlans: FoodPlan[];
  onNavigate: (tab: string) => void;
}

export const Food: React.FC<FoodProps> = ({ foodPlans, onNavigate }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    foodPlans[0]?.id || 'fp_standard_full'
  );

  const selectedPlan = foodPlans.find((p) => p.id === selectedPlanId) || foodPlans[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold text-xs px-3.5 py-1.5 rounded-full border border-emerald-200">
          <Utensils className="w-3.5 h-3.5 text-emerald-600" />
          <span>HYGIENIC RESIDENT MESS &amp; DINING</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F284B] tracking-tight">
          Food &amp; Mess Management
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Wholesome, home-style 3-time hot Pakistani meals. Freshly cooked twice a day using halal
          poultry, pure ghee, mineral filtered water, and seasonal farm vegetables.
        </p>
      </div>

      {/* Featured Cafeteria Image */}
      <div className="relative aspect-21/9 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
        <img
          src="/src/assets/images/quality_food_1791029029513.jpg"
          alt="Mess Cafeteria"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-transparent opacity-85"></div>
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Live Mess Dining Hall
            </div>
            <div className="text-xl sm:text-2xl font-black">
              Air-conditioned Dining Area with Hygienic Stainless Steel Counter
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-xs text-xs px-3 py-1.5 rounded-lg border border-slate-700">
            Open 7 Days a Week
          </div>
        </div>
      </div>

      {/* Timings Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Breakfast</div>
            <div className="text-base font-bold text-slate-900">7:00 AM – 9:30 AM</div>
            <div className="text-xs text-slate-500">Paratha / Omelette / Chai / Toast</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Lunch</div>
            <div className="text-base font-bold text-slate-900">1:00 PM – 3:00 PM</div>
            <div className="text-xs text-slate-500">Daal / Rice / Seasonal Veg / Salad</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Dinner</div>
            <div className="text-base font-bold text-slate-900">7:30 PM – 10:00 PM</div>
            <div className="text-xs text-slate-500">Chicken Curry / Roti / Biryani Special</div>
          </div>
        </div>
      </div>

      {/* Package Selector */}
      {foodPlans.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black text-[#0F284B]">Monthly Mess Packages</h2>
            <div className="flex gap-2">
              {foodPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                    selectedPlanId === plan.id
                      ? 'bg-[#0F284B] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {plan.name.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

          {selectedPlan && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Plan Pricing Card */}
              <div className="bg-gradient-to-b from-slate-900 to-[#0F284B] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                    Selected Package
                  </span>
                  <h3 className="text-xl font-bold mb-3">{selectedPlan.name}</h3>
                  <div className="text-3xl font-black text-white tabular-nums mb-1">
                    PKR {selectedPlan.price_pkr.toLocaleString()}
                    <span className="text-xs font-normal text-slate-300 block">per month (Separate from rent)</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                    {selectedPlan.menu_summary}
                  </p>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => onNavigate('book')}
                    className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition text-center shadow-xs"
                  >
                    Include in My Room Booking
                  </button>
                </div>
              </div>

              {/* Weekly Menu Schedule */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Weekly Rotating Menu Schedule</span>
                </h3>

                <div className="space-y-3">
                  {Object.entries(selectedPlan.menu_schedule || {}).map(([day, meal], idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5"
                    >
                      <span className="font-bold text-[#0F284B] w-28 shrink-0">{day}</span>
                      <span className="text-slate-600 flex-1">{meal}</span>
                    </div>
                  ))}
                </div>

                {/* Rules */}
                {selectedPlan.rules && selectedPlan.rules.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Mess Rules &amp; Guidelines
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-500">
                      {selectedPlan.rules.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
