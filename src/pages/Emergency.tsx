import React, { useState } from 'react';
import {
  Phone,
  ShieldAlert,
  AlertTriangle,
  Siren,
  Hospital,
  Flame,
  UserCheck,
  Send,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { EmergencyContact, HostelSettings } from '../types.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface EmergencyProps {
  contacts: EmergencyContact[];
  settings: HostelSettings | null;
  onNavigate: (tab: string) => void;
}

export const Emergency: React.FC<EmergencyProps> = ({ contacts, settings, onNavigate }) => {
  const { user } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');
  const [roomNum, setRoomNum] = useState('102');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAlert, setSubmittedAlert] = useState(false);

  const policeHelpline = settings?.police_helpline || '15';
  const policeStationPhone = settings?.police_station_phone || '+92 51 9258380';
  const rescueHelpline = settings?.emergency_helpline_1122 || '1122';
  const wardenContact = settings?.hostel_emergency_contact || '+92 300 1234567';
  const policeStationName = settings?.police_station_name || 'Sabzi Mandi / I-9 Police Station';
  const policeJurisdiction = settings?.police_jurisdiction || 'Islamabad Capital Territory Police';

  const handleQuickEmergencyReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText) return;

    setIsSubmitting(true);
    try {
      await api.createComplaint({
        user_id: user?.id || 'usr_guest',
        user_name: user?.full_name || 'Resident Emergency SOS',
        room_number: roomNum,
        phone: user?.phone || '+92 300 0000000',
        category: 'Emergency',
        severity: 'EMERGENCY',
        description: `[IMMEDIATE EMERGENCY SOS]: ${reportText}`,
        incident_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        incident_location: `Room #${roomNum}`,
        is_confidential: true,
      });
      setSubmittedAlert(true);
      setShowReportModal(false);
      setReportText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Red Alert Banner */}
      <div className="bg-gradient-to-r from-rose-700 to-red-600 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-red-500">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Siren className="w-4 h-4 animate-bounce" />
            <span>24/7 RAPID RESPONSE UNIT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Emergency Assistance
          </h1>
          <p className="text-sm sm:text-base text-rose-100 max-w-xl">
            If you are in immediate danger, facing physical threats, medical distress, or security
            breaches, dial the hotlines below immediately.
          </p>
        </div>

        {/* 4 Primary Action Buttons matching prompt specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto shrink-0">
          {/* 1. CALL POLICE */}
          <a
            href={`tel:${policeHelpline}`}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
          >
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>CALL POLICE ({policeHelpline})</span>
          </a>

          {/* 2. CALL EMERGENCY SERVICES */}
          <a
            href={`tel:${rescueHelpline}`}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-red-700 font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
          >
            <Hospital className="w-5 h-5 text-red-600" />
            <span>CALL RESCUE 1122</span>
          </a>

          {/* 3. CALL HOSTEL EMERGENCY CONTACT */}
          <a
            href={`tel:${wardenContact.replace(/\s+/g, '')}`}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
          >
            <Phone className="w-5 h-5" />
            <span>CALL HOSTEL WARDEN</span>
          </a>

          {/* 4. SUBMIT EMERGENCY REPORT */}
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center justify-center gap-2 bg-rose-950 hover:bg-rose-900 text-rose-100 font-bold text-sm px-6 py-3.5 rounded-xl border border-rose-400/30 transition shadow-lg"
          >
            <AlertTriangle className="w-5 h-5 text-amber-300" />
            <span>SUBMIT EMERGENCY REPORT</span>
          </button>
        </div>
      </div>

      {submittedAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="font-bold block">EMERGENCY ALERT DISPATCHED</span>
              <span>
                Duty warden notified. Security guard dispatched to your specified room location.
              </span>
            </div>
          </div>
          <button
            onClick={() => setSubmittedAlert(false)}
            className="font-bold underline text-emerald-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Emergency Contacts Directory */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-black text-[#0F284B]">Configured Jurisdiction Helplines</h2>
          <p className="text-xs text-slate-500">
            Emergency contact information verified and maintained by hostel administration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-slate-900 text-base">{contact.title}</h3>
                  <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {contact.service_type}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-4">{contact.description}</p>
                <div className="text-xs text-slate-500 mb-2">
                  <strong>Location:</strong> {contact.address}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-lg font-black text-rose-600 font-mono">
                    {contact.phone_number}
                  </div>
                  {contact.alternate_phone && (
                    <div className="text-[11px] text-slate-500">
                      Alt: {contact.alternate_phone}
                    </div>
                  )}
                </div>

                <a
                  href={`tel:${contact.phone_number.replace(/\s+/g, '')}`}
                  className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Hotline</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Police Jurisdiction Box */}
      <div className="bg-[#0B192C] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
              Official Police Registration
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">{policeStationName}</h3>
          </div>
          <button
            onClick={() => onNavigate('police-escalation')}
            className="self-start sm:self-auto flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
          >
            <span>View Law Enforcement Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div>
            <div className="text-slate-400">Jurisdiction Division:</div>
            <div className="font-semibold text-white mt-0.5">{policeJurisdiction}</div>
          </div>
          <div>
            <div className="text-slate-400">Station Phone:</div>
            <div className="font-semibold text-white mt-0.5">{policeStationPhone}</div>
          </div>
          <div>
            <div className="text-slate-400">National Emergency:</div>
            <div className="font-semibold text-rose-400 mt-0.5">15 (Toll Free)</div>
          </div>
        </div>
      </div>

      {/* Emergency Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-rose-500 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
              <Siren className="w-5 h-5 animate-pulse" />
              <span>Broadcast Immediate Emergency SOS</span>
            </div>

            <p className="text-xs text-slate-600">
              This triggers a high-priority alert on the warden control console and alerts hostel
              security guards.
            </p>

            <form onSubmit={handleQuickEmergencyReport} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Room Number / Current Location in Hostel *
                </label>
                <input
                  type="text"
                  value={roomNum}
                  onChange={(e) => setRoomNum(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-bold"
                  placeholder="e.g. Room 102 or Mess Hall"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nature of Emergency *
                </label>
                <textarea
                  rows={3}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Medical distress, fire, physical altercation, immediate danger..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Transmit Alert Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
