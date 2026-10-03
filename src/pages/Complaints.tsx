import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Send,
  CheckCircle,
  Clock,
  Lock,
  FileText,
  Upload,
  ArrowRight,
  Shield,
  PhoneCall,
  Flame,
} from 'lucide-react';
import { Complaint, ComplaintSeverity, ComplaintStatus } from '../types.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface ComplaintsProps {
  complaints: Complaint[];
  onRefreshComplaints: () => void;
  onNavigate: (tab: string) => void;
}

export const Complaints: React.FC<ComplaintsProps> = ({
  complaints,
  onRefreshComplaints,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState(user?.full_name || '');
  const [roomNumber, setRoomNumber] = useState('102');
  const [phone, setPhone] = useState(user?.phone || '+92 300 0000000');
  const [category, setCategory] = useState('Cleanliness');
  const [severity, setSeverity] = useState<ComplaintSeverity>('NORMAL');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState(
    new Date().toISOString().slice(0, 16).replace('T', ' ')
  );
  const [incidentLocation, setIncidentLocation] = useState('Room 102');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);

  const categories = [
    'Cleanliness',
    'Room',
    'Maintenance',
    'Electricity',
    'Water',
    'Wi-Fi',
    'Food',
    'Washroom',
    'Noise',
    'Staff Behavior',
    'Security',
    'Harassment',
    'Threats',
    'Physical Violence',
    'Theft',
    'Sexual Harassment/Abuse',
    'Illegal Activity',
    'Missing Person',
    'Emergency',
    'Other',
  ];

  // Auto-set severity if serious category selected
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    if (['Physical Violence', 'Sexual Harassment/Abuse', 'Missing Person', 'Emergency'].includes(cat)) {
      setSeverity('EMERGENCY');
    } else if (['Threats', 'Theft', 'Harassment', 'Illegal Activity', 'Security'].includes(cat)) {
      setSeverity('SERIOUS');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !roomNumber || !phone || !description) {
      setErrorMsg('Please complete all required complaint details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.createComplaint({
        user_id: user?.id || `usr_guest_${Date.now()}`,
        user_name: name,
        room_number: roomNumber,
        phone,
        category,
        severity,
        description,
        incident_date: incidentDate,
        incident_location: incidentLocation,
        evidence_url: evidenceUrl || undefined,
        is_confidential: isConfidential,
      });

      setSuccessMsg(
        `Complaint logged successfully! Complaint Tracking ID: ${res.complaint.complaint_id}. Management has been notified.`
      );
      onRefreshComplaints();
      setDescription('');
      setActiveTab('track');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit complaint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 font-bold text-xs px-3.5 py-1.5 rounded-full border border-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>RESPONSIVE COMPLAINT &amp; ESCALATION DESK</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F284B] tracking-tight">
          Resident Complaint Portal
        </h1>
        <p className="text-sm text-slate-600">
          Submit room maintenance, cleanliness, food, discipline, or emergency security complaints.
          All reports are tracked with strict accountability.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-slate-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('submit')}
            className={`pb-3 text-sm font-bold transition relative ${
              activeTab === 'submit'
                ? 'text-[#0F284B] border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Submit New Complaint
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`pb-3 text-sm font-bold transition relative flex items-center gap-1.5 ${
              activeTab === 'track'
                ? 'text-[#0F284B] border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Track Filed Complaints</span>
            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
              {complaints.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: SUBMIT COMPLAINT */}
      {activeTab === 'submit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Complaint Registration Form</span>
              <span className="text-xs font-normal text-slate-500">* All fields required</span>
            </h2>

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Ali Hamza"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                    placeholder="102"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                    placeholder="+92 300 0000000"
                    required
                  />
                </div>
              </div>

              {/* Category & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Complaint Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-medium text-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Severity Level *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['NORMAL', 'SERIOUS', 'EMERGENCY'] as ComplaintSeverity[]).map((sev) => (
                      <button
                        type="button"
                        key={sev}
                        onClick={() => setSeverity(sev)}
                        className={`py-2 text-[11px] font-bold rounded-lg border transition text-center ${
                          severity === sev
                            ? sev === 'EMERGENCY'
                              ? 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-500/30'
                              : sev === 'SERIOUS'
                              ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-500/30'
                              : 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500/30'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Incident Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Incident Date / Time
                  </label>
                  <input
                    type="text"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    placeholder="YYYY-MM-DD HH:MM"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Incident Location in Hostel
                  </label>
                  <input
                    type="text"
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                    placeholder="e.g. 1st Floor Corridor / Washroom / Mess"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Comprehensive Description *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the issue clearly so that the maintenance team or security officer can take specific action..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  required
                />
              </div>

              {/* Evidence URL / details */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Evidence Note / Photo Reference Link (Optional)
                </label>
                <input
                  type="text"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="e.g. Link to image screenshot or details of CCTV camera location"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              {/* Confidential Checkbox */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isConfidential}
                    onChange={(e) => setIsConfidential(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <div className="text-xs text-slate-700">
                    <span className="font-bold flex items-center gap-1 text-slate-900">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      Keep My Identity Confidential
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Your identity will be masked and visible solely to Senior Management &amp;
                      Police investigators.
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Registering Complaint...' : 'Submit Complaint'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Severity Guidelines Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#0B192C] text-white p-6 rounded-2xl shadow-md border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wide">
                Complaint Severity Workflow
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                  <div className="font-bold text-blue-400 mb-1">NORMAL SEVERITY</div>
                  <p className="text-slate-300">
                    Wi-Fi drops, bulb replacement, water pressure, room cleaning, food timing. Routed
                    directly to housekeeping staff.
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                  <div className="font-bold text-amber-400 mb-1">SERIOUS SEVERITY</div>
                  <p className="text-slate-300">
                    Theft, verbal abuse, repeated harassment, trespassing. Sent immediately to the
                    Hostel Admin and Head of Security with escalation tracking.
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-rose-500/40">
                  <div className="font-bold text-rose-400 mb-1 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> EMERGENCY SEVERITY
                  </div>
                  <p className="text-slate-300">
                    Physical assault, active threats, severe medical emergency. Triggers instantaneous
                    duty warden response and official police protocol.
                  </p>
                  <button
                    onClick={() => onNavigate('emergency')}
                    className="mt-2 text-rose-300 underline font-bold block"
                  >
                    Open Immediate Emergency SOS Page →
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Warden Contact */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 block">Immediate Warden Contact:</span>
              <p className="text-slate-600">
                For instant physical response, you can also dial the on-duty warden desk directly:
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 pt-1">
                <PhoneCall className="w-4 h-4" />
                <span>+92 300 1234567</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRACK FILED COMPLAINTS */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#0F284B]">Complaint History &amp; Resolution Tracking</h2>

          {complaints.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-base">No Active Complaints Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                You do not have any unresolved maintenance or discipline complaints.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((cmp) => (
                <div
                  key={cmp.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-[#0F284B] font-mono">
                        {cmp.complaint_id}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          cmp.severity === 'EMERGENCY'
                            ? 'bg-rose-100 text-rose-800'
                            : cmp.severity === 'SERIOUS'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {cmp.severity}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Category: {cmp.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-md ${
                          cmp.status === 'Resolved' || cmp.status === 'Closed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cmp.status === 'Escalated'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        ● {cmp.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 text-xs text-slate-600 gap-2">
                    <div>
                      <strong>Room:</strong> #{cmp.room_number} • <strong>Location:</strong>{' '}
                      {cmp.incident_location}
                    </div>
                    <div>
                      <strong>Logged Date:</strong> {new Date(cmp.created_at).toLocaleString()}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {cmp.description}
                  </p>

                  {/* Updates from administration */}
                  {cmp.resident_updates && cmp.resident_updates.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                        Management Updates &amp; Actions Taken:
                      </h4>
                      {cmp.resident_updates.map((upd, idx) => (
                        <div
                          key={idx}
                          className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 text-xs text-slate-800"
                        >
                          <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                            <span className="font-bold text-emerald-700">{upd.author}</span>
                            <span>{new Date(upd.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div>{upd.note}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* If police escalation linked */}
                  {cmp.police_escalation_id && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Formal Police Case Escalation File Linked</span>
                      </div>
                      <button
                        onClick={() => onNavigate('police-escalation')}
                        className="text-xs font-bold text-rose-700 underline"
                      >
                        View Official Police Status
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
