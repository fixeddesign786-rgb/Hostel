import React from 'react';
import { X, CheckCircle, Bed, Users, Shield, Zap, Droplets, Calendar, ArrowRight } from 'lucide-react';
import { Room } from '../types.ts';

interface RoomDetailsModalProps {
  room: Room | null;
  onClose: () => void;
  onBook: (room: Room) => void;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ room, onClose, onBook }) => {
  if (!room) return null;

  const isAvailable = room.status === 'AVAILABLE' && room.available_beds > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs z-10 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Room #{room.room_number} Details
              </h2>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                Floor {room.floor}
              </span>
            </div>
            <p className="text-xs text-slate-500">{room.seater_count}-Seater Accommodation</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Main Photo Gallery */}
          <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={room.images[0] || '/src/assets/images/comfortable_room_1791029014471.jpg'}
              alt={`Room ${room.room_number}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Bed className="w-4 h-4 text-emerald-400" />
              <span>
                {room.available_beds} of {room.capacity} beds currently open
              </span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Monthly Rent</span>
              <span className="text-2xl font-black text-[#0F284B]">
                PKR {room.monthly_rent.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block">Electricity backup included</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Security Deposit (Refundable)</span>
              <span className="text-xl font-bold text-slate-800">
                PKR {room.security_deposit.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 block">Returned upon checkout</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {room.description ||
                `Spacious ${room.seater_count}-seater student room situated on Floor ${room.floor}. Fully furnished with standard beds, premium spring/orthopedic mattresses, private study desks with power outlets, cupboards, and high-speed Wi-Fi.`}
            </p>
          </div>

          {/* Facilities Provided */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">Amenities Included</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {room.facilities.map((fac, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Rules */}
          {room.rules && room.rules.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2">Room Policies</h4>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                {room.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Status: </span>
            <span className={`text-xs font-bold ${isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isAvailable ? `${room.available_beds} Bed Available` : 'No Beds Available'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(room);
              }}
              disabled={!isAvailable}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg transition ${
                isAvailable
                  ? 'bg-[#059669] hover:bg-[#047857] text-white shadow-sm'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>BOOK THIS ROOM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
