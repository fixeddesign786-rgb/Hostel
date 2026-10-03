import React, { useState, useMemo } from 'react';
import { Room } from '../types.ts';
import { RoomCard } from '../components/RoomCard.tsx';
import { Search, Filter, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RoomsProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  onBookRoom: (room: Room) => void;
}

export const Rooms: React.FC<RoomsProps> = ({ rooms, onSelectRoom, onBookRoom }) => {
  const [seaterFilter, setSeaterFilter] = useState<number | 'ALL'>('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'AVAILABLE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'floor'>('price_asc');

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((r) => {
        if (seaterFilter !== 'ALL' && r.seater_count !== seaterFilter) return false;
        if (availabilityFilter === 'AVAILABLE' && (r.status !== 'AVAILABLE' || r.available_beds <= 0))
          return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            r.room_number.toLowerCase().includes(q) ||
            r.facilities.some((f) => f.toLowerCase().includes(q)) ||
            r.description.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.monthly_rent - b.monthly_rent;
        if (sortBy === 'price_desc') return b.monthly_rent - a.monthly_rent;
        if (sortBy === 'floor') return a.floor - b.floor;
        return 0;
      });
  }, [rooms, seaterFilter, availabilityFilter, searchQuery, sortBy]);

  const totalAvailableBeds = rooms
    .filter((r) => r.status === 'AVAILABLE')
    .reduce((sum, r) => sum + r.available_beds, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-1.5">
            <span className="w-5 h-0.5 bg-emerald-500"></span>
            <span>AVAILABLE ACCOMMODATIONS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F284B] tracking-tight">
            Rooms &amp; Living Spaces
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time live bed availability. Protected by automated double-booking prevention.
          </p>
        </div>

        {/* Live availability ticker */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <div className="text-xs text-slate-500">Live Status</div>
            <div className="text-sm font-bold text-emerald-800">
              {totalAvailableBeds} Total Beds Available Now
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Seater Filter Buttons */}
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Room Type:
            </span>
            {(['ALL', 1, 2, 3, 4] as const).map((count) => (
              <button
                key={count}
                onClick={() => setSeaterFilter(count)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  seaterFilter === count
                    ? 'bg-[#0F284B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {count === 'ALL' ? 'All Rooms' : `${count}-Seater`}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by room # or facility..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Sort Dropdown & Available Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setAvailabilityFilter(availabilityFilter === 'ALL' ? 'AVAILABLE' : 'ALL')
              }
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                availabilityFilter === 'AVAILABLE'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {availabilityFilter === 'AVAILABLE' ? '✓ Showing Available' : 'Available Only'}
            </button>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="floor">Floor Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No rooms match your filter criteria</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Try resetting your filters or selecting a different room capacity.
          </p>
          <button
            onClick={() => {
              setSeaterFilter('ALL');
              setAvailabilityFilter('ALL');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-emerald-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onBook={onBookRoom}
              onViewDetails={onSelectRoom}
            />
          ))}
        </div>
      )}
    </div>
  );
};
