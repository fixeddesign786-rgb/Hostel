import React from 'react';
import { Bed, Users, Shield, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Room } from '../types.ts';

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
  onViewDetails: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onBook, onViewDetails }) => {
  const isAvailable = room.status === 'AVAILABLE' && room.available_beds > 0;

  const getStatusBadge = () => {
    switch (room.status) {
      case 'AVAILABLE':
        return room.available_beds > 0 ? (
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {room.available_beds} Bed{room.available_beds > 1 ? 's' : ''} Available
          </span>
        ) : (
          <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            Fully Reserved
          </span>
        );
      case 'RESERVED':
        return (
          <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            Reserved
          </span>
        );
      case 'OCCUPIED':
        return (
          <span className="bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            Fully Occupied
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Under Maintenance
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            Unavailable
          </span>
        );
    }
  };

  const displayImage =
    room.images && room.images.length > 0
      ? room.images[0]
      : '/src/assets/images/comfortable_room_1791029014471.jpg';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group">
      {/* Room Photo */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={`Room ${room.room_number}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Status tag */}
        <div className="absolute top-3 left-3">{getStatusBadge()}</div>
        {/* Seater badge */}
        <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span>{room.seater_count}-Seater (Floor {room.floor})</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <h3 className="text-xl font-bold text-slate-900">
              Room #{room.room_number}
            </h3>
            <div className="text-right">
              <span className="text-2xl font-black text-[#0F284B] tabular-nums">
                Rs. {room.monthly_rent.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium block">/ month</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {room.description || `${room.seater_count}-person room with attached washroom, study desk and wardrobe.`}
          </p>

          {/* Key specs */}
          <div className="text-xs text-slate-600 space-y-1 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Security Deposit (Refundable):</span>
              <span className="font-semibold text-slate-800 tabular-nums">
                Rs. {room.security_deposit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Bed Capacity:</span>
              <span className="font-semibold text-slate-800">{room.capacity} Persons</span>
            </div>
          </div>

          {/* Facilities text list */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {room.facilities.slice(0, 4).map((f, i) => (
              <span
                key={i}
                className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
              >
                {f}
              </span>
            ))}
            {room.facilities.length > 4 && (
              <span className="text-[11px] text-slate-400 px-1 py-0.5">
                +{room.facilities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => onViewDetails(room)}
            className="flex-1 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition text-center"
          >
            View Details
          </button>

          <button
            onClick={() => onBook(room)}
            disabled={!isAvailable}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
              isAvailable
                ? 'bg-[#059669] hover:bg-[#047857] text-white shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{isAvailable ? 'Book Now' : 'Occupied'}</span>
            {isAvailable && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
