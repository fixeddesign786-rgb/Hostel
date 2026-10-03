import React, { useState } from 'react';
import {
  Calendar,
  Bed,
  Phone,
  ArrowRight,
  Home as HomeIcon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Facility, Room, HostelSettings } from '../types.ts';
import { FacilityCard } from '../components/FacilityCard.tsx';
import { LocationCard } from '../components/LocationCard.tsx';
import { RoomCard } from '../components/RoomCard.tsx';

interface HomeProps {
  facilities: Facility[];
  rooms: Room[];
  settings: HostelSettings | null;
  onNavigate: (tab: string, param?: string) => void;
  onSelectRoom: (room: Room) => void;
  onBookRoom: (room: Room) => void;
}

export const Home: React.FC<HomeProps> = ({
  facilities,
  rooms,
  settings,
  onNavigate,
  onSelectRoom,
  onBookRoom,
}) => {
  // Filter only enabled facilities (respects admin toggle)
  const enabledFacilities = facilities.filter((f) => f.is_enabled);

  return (
    <div className="space-y-16 pb-12">
      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center bg-[#071322] overflow-hidden">
        {/* Background Image with dark gradient scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_hostel_building_1791028979267.jpg"
            alt="Hostel Building"
            className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-in motion-safe:fade-in duration-700"
            referrerPolicy="no-referrer"
          />
          {/* Gradients ensuring 4.5:1 text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071322]/95 via-[#071322]/75 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#071322] via-transparent to-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-24 text-white">
          <div className="max-w-2xl space-y-6">
            {/* Pill kicker badge */}
            <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-slate-200 shadow-sm">
              <HomeIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>WELCOME TO OUR HOSTEL</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Comfortable, Clean &amp; Affordable{' '}
              <span className="text-emerald-400 drop-shadow-sm">Hostel Living</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-xl">
              Safe rooms, reliable facilities, Wi-Fi, electricity, clean water, food and
              professional hostel management.
            </p>

            {/* CTAs matching reference */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {/* Primary Green Button */}
              <button
                onClick={() => onNavigate('book')}
                className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white text-sm sm:text-base font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Room →</span>
              </button>

              {/* View Rooms pill button */}
              <button
                onClick={() => onNavigate('rooms')}
                className="flex items-center gap-2 bg-slate-900/75 hover:bg-slate-900/90 text-white text-sm sm:text-base font-semibold px-5 py-3.5 rounded-xl border border-slate-700/70 backdrop-blur-xs transition hover:border-slate-500"
              >
                <Bed className="w-4 h-4 text-emerald-400" />
                <span>View Rooms</span>
              </button>

              {/* Contact Hostel pill button */}
              <button
                onClick={() => onNavigate('contact')}
                className="flex items-center gap-2 bg-slate-900/75 hover:bg-slate-900/90 text-white text-sm sm:text-base font-semibold px-5 py-3.5 rounded-xl border border-slate-700/70 backdrop-blur-xs transition hover:border-slate-500"
              >
                <Phone className="w-4 h-4 text-sky-400" />
                <span>Contact Hostel</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- FACILITY STRIP (10 CARDS) ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {enabledFacilities.map((fac) => (
              <FacilityCard
                key={fac.id}
                facility={fac}
                onClick={() => onNavigate('facilities')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- ABOUT HOSTEL & LOCATION SECTION ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: About Our Hostel Description & 4-Photo Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-1.5">
                <span className="w-5 h-0.5 bg-emerald-500"></span>
                <span>ABOUT OUR HOSTEL</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F284B] tracking-tight mb-3">
                A Home Away From Home
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Our hostel provides a safe, clean and comfortable environment for students and
                working professionals. We focus on your comfort, safety and well-being with modern
                facilities, quality food and professional management.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B62CD] hover:text-[#0F284B] transition py-1"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4 Cards Grid with Photo Overlays matching approved reference */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              {/* Card 1: Modern Building */}
              <div
                onClick={() => onNavigate('gallery')}
                className="group relative rounded-xl overflow-hidden aspect-3/4 sm:aspect-4/5 bg-slate-900 cursor-pointer shadow-md hover:shadow-xl transition-all"
              >
                <img
                  src="/src/assets/images/hostel_exterior_1791028997189.jpg"
                  alt="Modern Building"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <div className="bg-[#0F284B] text-white text-xs font-bold py-1.5 px-3 rounded-full border border-sky-400/30 shadow-sm">
                    Modern Building
                  </div>
                </div>
              </div>

              {/* Card 2: Comfortable Rooms */}
              <div
                onClick={() => onNavigate('rooms')}
                className="group relative rounded-xl overflow-hidden aspect-3/4 sm:aspect-4/5 bg-slate-900 cursor-pointer shadow-md hover:shadow-xl transition-all"
              >
                <img
                  src="/src/assets/images/comfortable_room_1791029014471.jpg"
                  alt="Comfortable Rooms"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <div className="bg-[#0F284B] text-white text-xs font-bold py-1.5 px-3 rounded-full border border-sky-400/30 shadow-sm">
                    Comfortable Rooms
                  </div>
                </div>
              </div>

              {/* Card 3: Quality Food */}
              <div
                onClick={() => onNavigate('food')}
                className="group relative rounded-xl overflow-hidden aspect-3/4 sm:aspect-4/5 bg-slate-900 cursor-pointer shadow-md hover:shadow-xl transition-all"
              >
                <img
                  src="/src/assets/images/quality_food_1791029029513.jpg"
                  alt="Quality Food"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <div className="bg-[#0F284B] text-white text-xs font-bold py-1.5 px-3 rounded-full border border-sky-400/30 shadow-sm">
                    Quality Food
                  </div>
                </div>
              </div>

              {/* Card 4: Study Area */}
              <div
                onClick={() => onNavigate('gallery')}
                className="group relative rounded-xl overflow-hidden aspect-3/4 sm:aspect-4/5 bg-slate-900 cursor-pointer shadow-md hover:shadow-xl transition-all"
              >
                <img
                  src="/src/assets/images/study_area_1791029043422.jpg"
                  alt="Study Area"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <div className="bg-[#0F284B] text-white text-xs font-bold py-1.5 px-3 rounded-full border border-sky-400/30 shadow-sm">
                    Study Area
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Location Section matching reference */}
          <div className="lg:col-span-4">
            <LocationCard settings={settings} />
          </div>
        </div>
      </section>

      {/* ----------------- FEATURED ROOMS PREVIEW ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-1.5">
              <span className="w-5 h-0.5 bg-emerald-500"></span>
              <span>ACCOMMODATION SELECTION</span>
            </div>
            <h2 className="text-3xl font-black text-[#0F284B] tracking-tight">
              Featured Available Rooms
            </h2>
            <p className="text-sm text-slate-500">
              Pick from 1-seater executive to economical 4-seater shared rooms.
            </p>
          </div>

          <button
            onClick={() => onNavigate('rooms')}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-[#1B62CD] hover:text-[#0F284B] bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-lg transition"
          >
            <span>View All {rooms.length} Rooms</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.slice(0, 3).map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onBook={onBookRoom}
              onViewDetails={onSelectRoom}
            />
          ))}
        </div>
      </section>

      {/* ----------------- FINAL CTA BANNER MATCHING APPROVED REFERENCE ----------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-b from-[#F0F7FF] to-white rounded-3xl p-8 sm:p-10 border border-sky-100 shadow-lg text-center relative overflow-hidden">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-white text-[#1B62CD] rounded-2xl shadow-sm flex items-center justify-center border border-sky-100">
              <Calendar className="w-6 h-6 text-[#1B62CD]" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#0F284B] tracking-tight mb-2">
            Ready to Book Your Room?
          </h2>

          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            Choose your room, check availability and book your hostel room online.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('book')}
              className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
            >
              <span>Book a Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold px-6 py-3 rounded-xl border border-slate-300 shadow-xs transition"
            >
              Contact Hostel
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
