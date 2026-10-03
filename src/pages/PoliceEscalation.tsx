import React, { useState } from 'react';
import {
  Shield,
  FileCheck,
  AlertTriangle,
  ExternalLink,
  Phone,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { PoliceEscalation as PoliceEscType, HostelSettings, Complaint } from '../types.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface PoliceEscalationProps {
  escalations: PoliceEscType[];
  complaints: Complaint[];
  settings: HostelSettings | null;
  onRefresh: () => void;
  onNavigate: (tab: string) => void;
}

export const PoliceEscalation: React.FC<PoliceEscalationProps> = ({
  escalations,
  complaints,
  settings,
  onRefresh,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [selectedEscalation, setSelectedEscalation] = useState<PoliceEscType | null>(
    escalations[0] || null
  );

  const policeStation = settings?.police_station_name || 'Sabzi Mandi / I-9 Police Station';
  const policeJurisdiction = settings?.police_jurisdiction || 'Islamabad Capital Territory Police, Industrial Area Division';
  const policeHelpline = settings?.police_helpline || '15';
  const policePhone = settings?.police_station_phone || '+92 51 9258380';
  const policePortal = settings?.police_complaint_portal || 'https://islamabadpolice.gov.pk/citizen-services';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 font-bold text-xs px-3.5 py-1.5 rounded-full border border-blue-200">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>OFFICIAL POLICE &amp; LAW ENFORCEMENT ESCALATION HUB</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F284B] tracking-tight">
          Police Escalation &amp; Legal Liaison Portal
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          In compliance with Pakistani law, severe complaints (theft, assault, harassment, criminal
          breaches) are legally escalated to the relevant police station. We maintain complete
          transparency regarding official daily diary entries (Roznamcha) and FIR references.
        </p>
      </div>

      {/* Official Jurisdiction Bar */}
      <div className="bg-[#0B192C] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              Registered Police Jurisdiction
            </span>
            <h2 className="text-2xl font-black text-white">{policeStation}</h2>
            <div className="text-xs text-slate-400 mt-0.5">{policeJurisdiction}</div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={policePortal}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Official Citizen Police Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`tel:${policePhone.replace(/\s+/g, '')}`}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-slate-700"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Station Desk: {policePhone}</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300 pt-1">
          <div>
            <span className="text-slate-400 block mb-0.5">Emergency Police Helpline:</span>
            <span className="text-emerald-400 font-bold font-mono text-sm">15 (Toll Free)</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Punjab / ICT Harassment Cell:</span>
            <span className="text-white font-bold font-mono text-sm">8787 / 1099</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Evidence Retention Policy:</span>
            <span className="text-white font-semibold">30 Days Private CCTV Storage</span>
          </div>
        </div>
      </div>

      {/* Main Escalation Records List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-xl font-bold text-[#0F284B]">Active Police Escalation Cases</h3>
            <p className="text-xs text-slate-500">
              Only authentic, officially filed police complaints and investigation references are
              recorded here.
            </p>
          </div>

          {user && user.role !== 'STUDENT' && (
            <button
              onClick={() => onNavigate('admin-panel')}
              className="text-xs font-bold bg-[#0F284B] text-white px-3.5 py-1.5 rounded-lg"
            >
              Admin Escalation Controls
            </button>
          )}
        </div>

        {escalations.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-slate-800 text-base">No Escalated Police Matters</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our hostel premises are currently peaceful with zero open criminal or police
              investigations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* List */}
            <div className="lg:col-span-5 space-y-3">
              {escalations.map((esc) => (
                <div
                  key={esc.id}
                  onClick={() => setSelectedEscalation(esc)}
                  className={`p-5 rounded-2xl border cursor-pointer transition ${
                    selectedEscalation?.id === esc.id
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-black text-[#0F284B]">
                      {esc.police_reference_number || 'Pending Station Reg'}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {esc.escalation_status}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 mb-1">
                    {esc.category} Incident (Room #{esc.room_number})
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">
                    {esc.incident_details}
                  </p>

                  <div className="text-[10px] text-slate-500 flex justify-between pt-2 border-t border-slate-100">
                    <span>Station: {esc.police_station}</span>
                    <span>{new Date(esc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Details View */}
            {selectedEscalation && (
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      OFFICIAL LEGAL RECORD
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      {selectedEscalation.police_reference_number ? (
                        <span>FIR / Reference: {selectedEscalation.police_reference_number}</span>
                      ) : (
                        <span>Police Escalation Request ID: {selectedEscalation.id}</span>
                      )}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-md">
                      {selectedEscalation.escalation_status}
                    </span>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-500 block">Complaint ID:</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {selectedEscalation.complaint_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Investigating Officer:</span>
                    <span className="font-bold text-slate-800">
                      {selectedEscalation.officer_name || 'Assigned Duty ASI'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Incident Category:</span>
                    <span className="font-bold text-slate-800">{selectedEscalation.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Submission Date:</span>
                    <span className="font-bold text-slate-800">
                      {selectedEscalation.submission_date || 'Logged in Daily Diary'}
                    </span>
                  </div>
                </div>

                {/* Incident Narrative */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                    Incident Particulars Filed:
                  </h4>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                    {selectedEscalation.incident_details}
                  </p>
                </div>

                {/* Official Status History Log */}
                {selectedEscalation.status_history && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Official Investigation &amp; Status Timeline:</span>
                    </h4>

                    <div className="space-y-2 border-l-2 border-blue-200 pl-4 ml-1">
                      {selectedEscalation.status_history.map((log, idx) => (
                        <div key={idx} className="text-xs space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-blue-900">{log.status}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-600">{log.note}</p>
                          <div className="text-[10px] text-slate-400">
                            Logged by: {log.updated_by}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Identity Protection Notice */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-600 leading-relaxed">
                    <strong>Identity &amp; Privacy Protection:</strong> In accordance with our
                    confidentiality charter, the resident&apos;s identity and private room evidence
                    are masked from unauthorized third parties and disclosed exclusively to
                    authorized law enforcement officers.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
