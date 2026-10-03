import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Room,
  Booking,
  Payment,
  Resident,
  Complaint,
  PoliceEscalation,
  Facility,
  FoodPlan,
  HostelPolicy,
  GalleryItem,
  AuditLog,
  HostelSettings,
  PoliceEscalationStatus,
} from '../types.ts';
import { api } from '../services/api.ts';
import {
  LayoutDashboard,
  Bed,
  CalendarCheck,
  CreditCard,
  Users,
  Utensils,
  Sparkles,
  Image,
  FileText,
  AlertTriangle,
  Shield,
  Settings as SettingsIcon,
  Activity,
  Plus,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface AdminPanelProps {
  rooms: Room[];
  bookings: Booking[];
  payments: Payment[];
  complaints: Complaint[];
  policeEscalations: PoliceEscalation[];
  facilities: Facility[];
  foodPlans: FoodPlan[];
  policies: HostelPolicy[];
  gallery: GalleryItem[];
  settings: HostelSettings | null;
  onRefreshAll: () => void;
  onNavigate: (tab: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  rooms,
  bookings,
  payments,
  complaints,
  policeEscalations,
  facilities,
  foodPlans,
  policies,
  gallery,
  settings,
  onRefreshAll,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'rooms'
    | 'bookings'
    | 'payments'
    | 'residents'
    | 'complaints'
    | 'police'
    | 'facilities'
    | 'food'
    | 'policies'
    | 'gallery'
    | 'settings'
    | 'audit'
  >('dashboard');

  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Modals & form state
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    room_number: '',
    room_type_id: 'rt_2seater',
    seater_count: 2,
    floor: 1,
    capacity: 2,
    monthly_rent: 19500,
    security_deposit: 12000,
    available_beds: 2,
    facilities: 'Attached Bath, High Speed Wi-Fi, Balcony, Lockers',
    status: 'AVAILABLE' as const,
    rules: 'No smoking, Curfew 10:00 PM',
    description: 'Clean modern twin sharing room.',
    images: ['/src/assets/images/comfortable_room_1791029014471.jpg'],
  });

  // Complaint action state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [complaintStaff, setComplaintStaff] = useState('');
  const [complaintReply, setComplaintReply] = useState('');
  const [complaintStatus, setComplaintStatus] = useState<Complaint['status']>('In Progress');

  // Police escalation action state
  const [selectedPoliceEsc, setSelectedPoliceEsc] = useState<PoliceEscalation | null>(null);
  const [newPoliceRef, setNewPoliceRef] = useState('');
  const [newPoliceStatus, setNewPoliceStatus] = useState<PoliceEscalationStatus>('UNDER INVESTIGATION');
  const [policeOfficer, setPoliceOfficer] = useState('');
  const [policeNote, setPoliceNote] = useState('');

  // Settings form
  const [settingsForm, setSettingsForm] = useState<HostelSettings | null>(settings);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const statsRes = await api.getStats();
        setStats(statsRes.stats);
        const logsRes = await api.getAuditLogs();
        setAuditLogs(logsRes.logs);
      } catch (err) {
        console.error('Error loading admin metadata:', err);
      }
    }
    loadAdminData();
    if (settings) setSettingsForm(settings);
  }, [settings]);

  const showBanner = (msg: string, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  // 1. Room Handlers
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createRoom({
        ...newRoomData,
        facilities: newRoomData.facilities.split(',').map((s) => s.trim()),
        rules: newRoomData.rules.split(',').map((s) => s.trim()),
      });
      showBanner(`Room #${newRoomData.room_number} added successfully.`);
      setShowAddRoomModal(false);
      onRefreshAll();
    } catch (err: any) {
      showBanner(err.message, true);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      await api.deleteRoom(id);
      showBanner('Room deleted.');
      onRefreshAll();
    } catch (err: any) {
      showBanner(err.message, true);
    }
  };

  // 2. Booking Handlers
  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await api.updateBookingStatus(id, status);
      showBanner(`Booking status updated to ${status}.`);
      onRefreshAll();
    } catch (err: any) {
      showBanner(err.message, true);
    }
  };

  // 3. Payment Handlers
  const handleVerifyPayment = async (id: string) => {
    try {
      await api.verifyPayment(id);
      showBanner('Payment verified! Resident notified and room booking confirmed.');
      onRefreshAll();
    } catch (err: any) {
      showBanner(err.message, true);
    }
  };

  const handleRejectPayment = async (id: string) => {
    const reason = prompt('Enter rejection reason for the resident:', 'Transaction reference not found in bank ledger.');
    if (!reason) return;
    try {
      await api.rejectPayment(id, reason);
      showBanner('Payment rejected. Resident requested to re-submit.');
      onRefreshAll();
    } catch (err: any) {
      showBanner(err.message, true);
    }
  };

  // 4. Facility Toggle
  const handleToggleFacility = async (id: string, current: boolean) => {
    try {
      await api.toggleFacility(id, !current);
      showBanner(`Facility ${!current ? 'Enabled' : 'Disabled'}. Instantly synced to frontend.`);
      onRefreshAll();
    } catch (err: any) {
      showBanner(err.message, true);
    }
  };

  // 5. Update Complaint
  const handleSaveComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    try {
      await api.updateComplaint(selectedComplaint.id, {
        status: complaintStatus,
        assigned_to: complaintStaff || undefined,
        resident_update: complaintReply || undefined,
      });
      showBanner(`Complaint ${selectedComplaint.complaint_id} updated.`);
      setSelectedComplaint(null);
      setComplaintReply('');
      onRefreshAll();
    } catch (err: any) {
      showBanner(err.message, true);
    }
  };

  // 6. Initiate Police Escalation
  const handleEscalateToPolice = async (complaint: Complaint) => {
    if (!confirm(`Are you sure you want to escalate Complaint ${complaint.complaint_id} to Police?`)) return;
    try {
      await api.createPoliceEscalation({
        complaint_id: complaint.complaint_id,
        notes: `Urgent police escalation initiated by ${user?.full_name || 'Admin'} for ${complaint.category}.`,
      });
      showBanner('Case successfully escalated to official police department.');
      onRefreshAll();
      setActiveTab('police');
    } catch (err: any) {
      showBanner(err.message, true);
    }
  };

  // 7. Update Police Escalation
  const handleSavePoliceUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoliceEsc) return;
    try {
      await api.updatePoliceEscalation(selectedPoliceEsc.id, {
        status: newPoliceStatus,
        police_reference_number: newPoliceRef || undefined,
        officer_name: policeOfficer || undefined,
        status_note: policeNote || undefined,
      });
      showBanner(`Police Escalation record updated with status ${newPoliceStatus}.`);
      setSelectedPoliceEsc(null);
      setPoliceNote('');
      onRefreshAll();
    } catch (err: any) {
      showBanner(err.message, true);
    }
  };

  // 8. Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    try {
      await api.updateSettings(settingsForm);
      showBanner('Hostel settings & emergency contact coordinates saved.');
      onRefreshAll();
    } catch (err: any) {
      showBanner(err.message, true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>HOSTEL MANAGEMENT SYSTEM (RBAC)</span>
          </div>
          <h1 className="text-3xl font-black text-[#0F284B]">Central Administration Panel</h1>
          <p className="text-xs text-slate-500">
            Logged in as: <strong>{user?.full_name}</strong> ({user?.role.replace('_', ' ')})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Preview Frontend
          </button>
          <button
            onClick={onRefreshAll}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0F284B] rounded-lg shadow-xs"
          >
            Refresh Database
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 mb-6 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 mb-6 bg-rose-50 border border-rose-300 text-rose-900 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Grid: Navigation Bar + Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <nav className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 text-xs font-semibold">
          {[
            { id: 'dashboard', label: 'Dashboard & Charts', icon: LayoutDashboard },
            { id: 'rooms', label: 'Rooms & Bed Capacity', icon: Bed },
            { id: 'bookings', label: 'Bookings Management', icon: CalendarCheck },
            { id: 'payments', label: 'Payment Verifier', icon: CreditCard },
            { id: 'complaints', label: 'Complaints Portal', icon: AlertTriangle },
            { id: 'police', label: 'Police Escalations', icon: Shield },
            { id: 'facilities', label: 'Facilities Control', icon: Sparkles },
            { id: 'food', label: 'Food & Mess Plans', icon: Utensils },
            { id: 'policies', label: 'Policies Editor', icon: FileText },
            { id: 'gallery', label: 'Gallery Manager', icon: Image },
            { id: 'settings', label: 'Hostel Settings', icon: SettingsIcon },
            { id: 'audit', label: 'Audit Trail Logs', icon: Activity },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                  activeTab === item.id
                    ? 'bg-[#0F284B] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.id === 'payments' && stats?.pendingPayments > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {stats.pendingPayments}
                  </span>
                )}
                {item.id === 'complaints' && stats?.seriousComplaints > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {stats.seriousComplaints}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Content Body */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: DASHBOARD METRICS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">Total Rooms</div>
                  <div className="text-2xl font-black text-[#0F284B] mt-1">{stats?.totalRooms || rooms.length}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">{stats?.availableRooms || 0} Available</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">Pending Payments</div>
                  <div className="text-2xl font-black text-amber-600 mt-1">{stats?.pendingPayments || 0}</div>
                  <div className="text-[11px] text-slate-400">Manual review required</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">Verified Revenue</div>
                  <div className="text-2xl font-black text-emerald-700 mt-1 tabular-nums">
                    PKR {(stats?.totalRevenue || 73000).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400">Ledger matched</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">Open Complaints</div>
                  <div className="text-2xl font-black text-rose-600 mt-1">{stats?.openComplaints || 2}</div>
                  <div className="text-[11px] text-rose-700 font-bold">{stats?.policeEscalations || 1} Police Cases</div>
                </div>
              </div>

              {/* Quick Actions & Recent Bookings */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm">Recent Booking Registrations</h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {bookings.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          {b.user_name} (Room #{b.room_number})
                        </div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          Ref: {b.booking_id} • CNIC: {b.user_cnic}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold tabular-nums text-slate-800">
                          PKR {b.total_initial_payment.toLocaleString()}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROOM MANAGEMENT */}
          {activeTab === 'rooms' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Room Inventory &amp; Double-Booking Protection</h2>
                  <p className="text-xs text-slate-500">Live bed count allocations prevent double booking automatically.</p>
                </div>
                <button
                  onClick={() => setShowAddRoomModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Room</span>
                </button>
              </div>

              <div className="space-y-3">
                {rooms.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-300 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-base text-[#0F284B]">Room #{r.room_number}</span>
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          {r.seater_count}-Seater (Floor {r.floor})
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            r.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <div className="text-slate-600">
                        Monthly Rent: <strong>PKR {r.monthly_rent.toLocaleString()}</strong> • Security Deposit: Rs.{' '}
                        {r.security_deposit.toLocaleString()}
                      </div>
                      <div className="text-emerald-700 font-semibold mt-1">
                        {r.available_beds} of {r.capacity} beds currently open
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteRoom(r.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BOOKINGS MANAGEMENT */}
          {activeTab === 'bookings' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Hostel Booking Admissions
              </h2>

              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {b.user_name} (Room #{b.room_number})
                        </div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          Booking ID: {b.booking_id} • Phone: {b.user_phone}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0F284B] tabular-nums">
                          PKR {b.total_initial_payment.toLocaleString()}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                          {b.status}
                        </span>
                      </div>
                    </div>

                    {/* Quick status change buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 mr-1">Update Status:</span>
                      {['CONFIRMED', 'CHECKED-IN', 'CHECKED-OUT', 'REJECTED'].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateBookingStatus(b.id, st)}
                          disabled={b.status === st}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition ${
                            b.status === st
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                          }`}
                        >
                          Mark {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS VERIFICATION */}
          {activeTab === 'payments' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Payment Ledger Verification Desk</h2>
                <p className="text-xs text-slate-500">
                  Manual bank statement verification. Verifying payment automatically confirms booking and allocates the bed!
                </p>
              </div>

              <div className="space-y-3">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-slate-900">{p.payment_id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.status === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'VERIFICATION PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div className="text-slate-700">
                        <strong>{p.user_name}</strong> • Amount: <strong>PKR {p.amount.toLocaleString()}</strong> (
                        {p.payment_method})
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        TxID: {p.transaction_id} • Date: {p.payment_date}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {p.status === 'VERIFICATION PENDING' && (
                        <>
                          <button
                            onClick={() => handleVerifyPayment(p.id)}
                            className="px-3.5 py-1.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-lg text-xs shadow-xs"
                          >
                            ✓ Verify Payment
                          </button>
                          <button
                            onClick={() => handleRejectPayment(p.id)}
                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                          >
                            ✕ Reject
                          </button>
                        </>
                      )}
                      {p.status === 'VERIFIED' && (
                        <span className="text-xs font-bold text-emerald-700">Verified &amp; Confirmed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COMPLAINTS ADMIN */}
          {activeTab === 'complaints' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Resident Complaints &amp; Work Orders
              </h2>

              <div className="space-y-4">
                {complaints.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0F284B]">{c.complaint_id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.severity === 'EMERGENCY'
                              ? 'bg-rose-100 text-rose-800'
                              : c.severity === 'SERIOUS'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {c.severity}
                        </span>
                        <span className="text-slate-600 font-bold">{c.category}</span>
                      </div>
                      <span className="font-bold text-xs bg-slate-100 px-2 py-0.5 rounded">Status: {c.status}</span>
                    </div>

                    <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {c.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <span className="text-slate-500">
                        Resident: <strong>{c.user_name}</strong> (Room #{c.room_number})
                      </span>

                      <div className="flex items-center gap-2">
                        {(c.severity === 'SERIOUS' || c.severity === 'EMERGENCY') && !c.police_escalation_id && (
                          <button
                            onClick={() => handleEscalateToPolice(c)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                          >
                            Escalate to Police
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedComplaint(c);
                            setComplaintStatus(c.status);
                            setComplaintStaff(c.assigned_to || '');
                          }}
                          className="px-3 py-1 bg-[#0F284B] hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                        >
                          Manage / Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: POLICE ESCALATIONS ADMIN */}
          {activeTab === 'police' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Official Police &amp; FIR Escalation Center</h2>
                <p className="text-xs text-slate-500">
                  Manage formal daily diary (Roznamcha) numbers, investigating officers, and case statuses.
                </p>
              </div>

              <div className="space-y-3">
                {policeEscalations.map((esc) => (
                  <div key={esc.id} className="p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-sm text-[#0F284B]">
                          {esc.police_reference_number || 'Pending FIR Number'}
                        </span>
                        <div className="text-slate-500">Station: {esc.police_station}</div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {esc.escalation_status}
                      </span>
                    </div>

                    <div className="text-slate-700">
                      <strong>Incident:</strong> {esc.incident_details}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-slate-500">Complainant: {esc.complainant_name}</span>
                      <button
                        onClick={() => {
                          setSelectedPoliceEsc(esc);
                          setNewPoliceStatus(esc.escalation_status);
                          setNewPoliceRef(esc.police_reference_number || '');
                          setPoliceOfficer(esc.officer_name || '');
                        }}
                        className="px-3 py-1 bg-[#0F284B] text-white font-bold rounded-lg text-xs"
                      >
                        Update FIR Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: FACILITIES MANAGEMENT */}
          {activeTab === 'facilities' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Hostel Facilities &amp; Amenities Toggle</h2>
                <p className="text-xs text-slate-500">
                  Disabling a facility here instantly removes it from the public homepage and facilities page!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {facilities.map((fac) => (
                  <div
                    key={fac.id}
                    className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{fac.name}</div>
                      <div className="text-slate-500 text-[11px]">{fac.highlight}</div>
                    </div>
                    <button
                      onClick={() => handleToggleFacility(fac.id, fac.is_enabled)}
                      className={`px-3 py-1 font-bold rounded-lg transition ${
                        fac.is_enabled
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-800'
                          : 'bg-slate-200 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                    >
                      {fac.is_enabled ? 'Enabled ✓' : 'Disabled ✕'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && settingsForm && (
            <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                Hostel Configuration &amp; Payment Accounts
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Hostel Name</label>
                  <input
                    type="text"
                    value={settingsForm.hostel_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hostel_name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Email</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">JazzCash Account Number</label>
                  <input
                    type="text"
                    value={settingsForm.jazzcash_number}
                    onChange={(e) => setSettingsForm({ ...settingsForm, jazzcash_number: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Easypaisa Account Number</label>
                  <input
                    type="text"
                    value={settingsForm.easypaisa_number}
                    onChange={(e) => setSettingsForm({ ...settingsForm, easypaisa_number: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          )}

          {/* TAB 9: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                Immutable Audit Trail Logs
              </h2>
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>
                        {log.action} • {log.user_name} ({log.role})
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Add Room */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Add New Hostel Room</h3>
            <form onSubmit={handleAddRoom} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Room Number *</label>
                  <input
                    type="text"
                    value={newRoomData.room_number}
                    onChange={(e) => setNewRoomData({ ...newRoomData, room_number: e.target.value })}
                    placeholder="e.g. 203"
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Seater Capacity *</label>
                  <select
                    value={newRoomData.seater_count}
                    onChange={(e) => {
                      const c = Number(e.target.value);
                      setNewRoomData({
                        ...newRoomData,
                        seater_count: c,
                        capacity: c,
                        available_beds: c,
                      });
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value={1}>1-Seater</option>
                    <option value={2}>2-Seater</option>
                    <option value={3}>3-Seater</option>
                    <option value={4}>4-Seater</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Monthly Rent (PKR) *</label>
                  <input
                    type="number"
                    value={newRoomData.monthly_rent}
                    onChange={(e) =>
                      setNewRoomData({ ...newRoomData, monthly_rent: Number(e.target.value) })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Security Deposit (PKR) *</label>
                  <input
                    type="number"
                    value={newRoomData.security_deposit}
                    onChange={(e) =>
                      setNewRoomData({ ...newRoomData, security_deposit: Number(e.target.value) })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#059669] text-white font-bold rounded-lg"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Complaint Action */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">
              Manage Complaint #{selectedComplaint.complaint_id}
            </h3>
            <form onSubmit={handleSaveComplaint} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Update Status</label>
                <select
                  value={complaintStatus}
                  onChange={(e: any) => setComplaintStatus(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Escalated">Escalated</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Assign Staff / Warden</label>
                <input
                  type="text"
                  value={complaintStaff}
                  onChange={(e) => setComplaintStaff(e.target.value)}
                  placeholder="e.g. Electrician or Security Head"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Reply / Update to Resident</label>
                <textarea
                  rows={3}
                  value={complaintReply}
                  onChange={(e) => setComplaintReply(e.target.value)}
                  placeholder="Note visible to student in their complaint tracker..."
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F284B] text-white font-bold rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Police Escalation Update */}
      {selectedPoliceEsc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Update Official Police Records</h3>
            <form onSubmit={handleSavePoliceUpdate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Police FIR / Diary Reference Number</label>
                <input
                  type="text"
                  value={newPoliceRef}
                  onChange={(e) => setNewPoliceRef(e.target.value)}
                  placeholder="e.g. ICT-FIR-2026/894-B"
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Official Status</label>
                <select
                  value={newPoliceStatus}
                  onChange={(e: any) => setNewPoliceStatus(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="RECEIVED">RECEIVED</option>
                  <option value="FORWARDED">FORWARDED</option>
                  <option value="UNDER INVESTIGATION">UNDER INVESTIGATION</option>
                  <option value="ACTION TAKEN">ACTION TAKEN</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Investigating Officer Name</label>
                <input
                  type="text"
                  value={policeOfficer}
                  onChange={(e) => setPoliceOfficer(e.target.value)}
                  placeholder="e.g. ASI Naveed Akhtar"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Status Update Narrative</label>
                <textarea
                  rows={3}
                  value={policeNote}
                  onChange={(e) => setPoliceNote(e.target.value)}
                  placeholder="Official status record notes..."
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPoliceEsc(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F284B] text-white font-bold rounded-lg"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
