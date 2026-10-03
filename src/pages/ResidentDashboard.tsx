import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  User,
  Booking,
  Payment,
  Invoice,
  Complaint,
  NotificationItem,
  Room,
} from '../types.ts';
import {
  Bed,
  CreditCard,
  FileText,
  AlertTriangle,
  Bell,
  User as UserIcon,
  LogOut,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  Shield,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api.ts';

interface ResidentDashboardProps {
  bookings: Booking[];
  payments: Payment[];
  invoices: Invoice[];
  complaints: Complaint[];
  notifications: NotificationItem[];
  rooms: Room[];
  onRefreshData: () => void;
  onNavigate: (tab: string) => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  bookings,
  payments,
  invoices,
  complaints,
  notifications,
  rooms,
  onRefreshData,
  onNavigate,
}) => {
  const { user, logout } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'profile' | 'booking' | 'room' | 'payments' | 'invoices' | 'complaints' | 'notifications'
  >('overview');

  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  // My booking
  const myBooking = bookings.find((b) => b.user_id === user?.id || b.user_email === user?.email) || bookings[0];
  const myRoom = rooms.find((r) => r.id === myBooking?.room_id || r.room_number === myBooking?.room_number);
  const myPayments = payments.filter((p) => p.user_id === user?.id || p.booking_id === myBooking?.booking_id);
  const myComplaints = complaints.filter((c) => c.user_id === user?.id);

  // Print invoice handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-6">
          {/* User brief */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-[#0F284B] text-emerald-400 font-bold flex items-center justify-center text-lg shadow-sm">
              {user?.full_name ? user.full_name[0] : 'R'}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm truncate">{user?.full_name || 'Resident'}</h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Active Resident
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Dashboard', icon: Calendar },
              { id: 'profile', label: 'My Profile', icon: UserIcon },
              { id: 'booking', label: 'My Booking', icon: FileText },
              { id: 'room', label: 'My Room', icon: Bed },
              { id: 'payments', label: 'Payments History', icon: CreditCard },
              { id: 'invoices', label: 'Invoices', icon: Printer },
              { id: 'complaints', label: 'Complaints Tracking', icon: AlertTriangle },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                    activeSubTab === item.id
                      ? 'bg-[#0F284B] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-4 border-t border-slate-100 space-y-1">
              <button
                onClick={() => onNavigate('emergency')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition font-bold"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Emergency Helpdesk</span>
              </button>

              <button
                onClick={() => onNavigate('policies')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-xl transition"
              >
                <Shield className="w-4 h-4 shrink-0" />
                <span>Hostel Policies</span>
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-500 hover:text-rose-600 rounded-xl transition"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* SUB-VIEW 1: OVERVIEW DASHBOARD */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#0F284B] to-[#1B62CD] text-white p-6 sm:p-7 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                    Student / Resident Portal
                  </span>
                  <h2 className="text-2xl font-black">Assalam-o-Alaikum, {user?.full_name || 'Resident'}!</h2>
                  <p className="text-xs text-slate-200 mt-1">
                    {myRoom ? `Allocated to Room #${myRoom.room_number}` : 'Your room booking is being processed.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveSubTab('complaints')}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition"
                  >
                    Report Issue
                  </button>
                  <button
                    onClick={() => onNavigate('emergency')}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
                  >
                    SOS Emergency
                  </button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Room */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Current Room</span>
                    <Bed className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-[#0F284B]">
                    Room #{myBooking ? myBooking.room_number : '102'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Floor {myRoom?.floor || 1} • {myBooking?.seater_count || 2}-Seater Room
                  </div>
                </div>

                {/* Booking Status */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Booking Status</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-lg font-black text-emerald-700">
                    {myBooking ? myBooking.status : 'CONFIRMED'}
                  </div>
                  <div className="text-xs text-slate-500">ID: {myBooking?.booking_id || 'HST-2026-1001'}</div>
                </div>

                {/* Next Rent Due */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Next Rent Due</span>
                    <CreditCard className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tabular-nums">
                    PKR {(myRoom?.monthly_rent || 19500).toLocaleString()}
                  </div>
                  <div className="text-xs text-amber-700 font-semibold">Due by 5th of Next Month</div>
                </div>
              </div>

              {/* Active Complaints & Notifications Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Complaints */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">Open Complaints</h3>
                    <button
                      onClick={() => setActiveSubTab('complaints')}
                      className="text-xs text-emerald-600 font-bold hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  {myComplaints.length === 0 ? (
                    <div className="text-xs text-slate-500 py-4 text-center">
                      No pending complaints logged.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {myComplaints.slice(0, 3).map((cmp) => (
                        <div
                          key={cmp.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-800">{cmp.category} Issue</div>
                            <div className="text-[11px] text-slate-500 font-mono">{cmp.complaint_id}</div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                            {cmp.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notifications Feed */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">Recent Alerts</h3>
                    <span className="text-xs text-slate-400">Hostel Desk</span>
                  </div>
                  <div className="space-y-2.5">
                    {notifications.slice(0, 3).map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                      >
                        <div className="font-bold text-slate-800">{notif.title}</div>
                        <p className="text-[11px] text-slate-600">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: PROFILE */}
          {activeSubTab === 'profile' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Resident Profile &amp; Verification Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Full Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{user?.full_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">CNIC / B-Form:</span>
                  <span className="font-bold text-slate-900 font-mono">{user?.cnic || '35201-1234567-1'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Registered Email:</span>
                  <span className="font-bold text-slate-900">{user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Mobile Phone:</span>
                  <span className="font-bold text-slate-900">{user?.phone || '+92 300 0000000'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block mb-0.5">Permanent Home Address:</span>
                  <span className="font-bold text-slate-900">
                    {user?.address || 'Plot 12, Street 4, Model Town, Lahore'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: MY BOOKING */}
          {activeSubTab === 'booking' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900">Active Room Booking</h2>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  {myBooking?.status || 'CONFIRMED'}
                </span>
              </div>

              {myBooking && (
                <div className="space-y-4 text-xs text-slate-700">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-500 block">Booking Reference:</span>
                      <span className="font-mono font-bold text-slate-900">{myBooking.booking_id}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Room Number:</span>
                      <span className="font-bold text-slate-900">Room #{myBooking.room_number}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Check-in Date:</span>
                      <span className="font-bold text-slate-900">{myBooking.check_in_date}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Stay Duration:</span>
                      <span className="font-bold text-slate-900">{myBooking.stay_duration_months} Months</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Food / Mess Plan:</span>
                      <span className="font-bold text-slate-900">
                        {myBooking.food_required ? 'Full Board Included' : 'No Food Plan'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Security Deposit:</span>
                      <span className="font-bold text-slate-900">
                        PKR {myBooking.security_deposit?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW 4: PAYMENTS HISTORY */}
          {activeSubTab === 'payments' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900">Payment &amp; Ledger History</h2>
                <span className="text-xs text-slate-500">Official JazzCash / Easypaisa Receipts</span>
              </div>

              <div className="space-y-3">
                {myPayments.length === 0 ? (
                  <div className="text-xs text-slate-500 py-6 text-center">No payment history found.</div>
                ) : (
                  myPayments.map((pay) => (
                    <div
                      key={pay.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#0F284B]">{pay.payment_id}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              pay.status === 'VERIFIED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : pay.status === 'VERIFICATION PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {pay.status}
                          </span>
                        </div>
                        <div className="text-slate-600">
                          Channel: <strong>{pay.payment_method}</strong> • TxID: {pay.transaction_id}
                        </div>
                        <div className="text-[11px] text-slate-400">Date: {pay.payment_date}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-[#0F284B] tabular-nums">
                          PKR {pay.amount.toLocaleString()}
                        </div>
                        {pay.verified_by && (
                          <div className="text-[10px] text-emerald-700">Verified by {pay.verified_by}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SUB-VIEW 5: INVOICES (PRINTABLE) */}
          {activeSubTab === 'invoices' && (
            <div className="space-y-6">
              {activeInvoice ? (
                /* Full printable invoice view */
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 print:m-0 print:border-none print:shadow-none">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0F284B] text-white flex items-center justify-center rounded-lg font-bold">
                        H
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-[#0F284B]">OFFICIAL HOSTEL INVOICE</h2>
                        <span className="text-xs text-slate-500">Invoice #{activeInvoice.invoice_number}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                      <button
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#0F284B] text-white text-xs font-bold rounded-lg"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice</span>
                      </button>
                      <button
                        onClick={() => setActiveInvoice(null)}
                        className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                      >
                        Back
                      </button>
                    </div>
                  </div>

                  {/* Invoice Header Details */}
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Billed To Resident:</span>
                      <strong className="text-sm text-slate-900 block">{activeInvoice.user_name}</strong>
                      <div>Booking Ref: {activeInvoice.booking_id}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block mb-0.5">Invoice Date:</span>
                      <strong className="block text-slate-900">{activeInvoice.issue_date}</strong>
                      <div>Due Date: {activeInvoice.due_date}</div>
                      <div
                        className={`font-bold mt-1 ${
                          activeInvoice.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        STATUS: {activeInvoice.status}
                      </div>
                    </div>
                  </div>

                  {/* Table Breakdown */}
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-y border-slate-200">
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-3 text-right">Amount (PKR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2.5 px-3 font-medium">Room Accommodation Monthly Rent</td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          Rs. {activeInvoice.room_rent.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-medium">Security Deposit (Refundable)</td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          Rs. {activeInvoice.security_deposit.toLocaleString()}
                        </td>
                      </tr>
                      {activeInvoice.food_charges > 0 && (
                        <tr>
                          <td className="py-2.5 px-3 font-medium">Monthly Food &amp; Mess Charges</td>
                          <td className="py-2.5 px-3 text-right tabular-nums">
                            Rs. {activeInvoice.food_charges.toLocaleString()}
                          </td>
                        </tr>
                      )}
                      <tr className="border-t-2 border-slate-300 font-bold bg-slate-50">
                        <td className="py-3 px-3 text-sm text-[#0F284B]">Total Initial Payment</td>
                        <td className="py-3 px-3 text-right text-base text-emerald-700 tabular-nums">
                          PKR {activeInvoice.total_amount.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-100 leading-relaxed">
                    This is an electronically generated receipt for hostel accommodation dues under
                    Pakistani rental regulations. Retain this invoice copy for tax and student
                    clearance verification.
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Invoices &amp; Official Receipts
                  </h2>
                  <div className="space-y-3">
                    {invoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:border-slate-300 transition"
                      >
                        <div>
                          <div className="font-mono font-bold text-slate-900">{inv.invoice_number}</div>
                          <div className="text-slate-500">Issued: {inv.issue_date}</div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-black text-slate-900 tabular-nums">
                              PKR {inv.total_amount.toLocaleString()}
                            </div>
                            <span
                              className={`text-[10px] font-bold ${
                                inv.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                              }`}
                            >
                              ● {inv.status}
                            </span>
                          </div>

                          <button
                            onClick={() => setActiveInvoice(inv)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1"
                          >
                            <span>View / Print</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW 6: COMPLAINTS */}
          {activeSubTab === 'complaints' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900">My Complaints &amp; Work Orders</h2>
                <button
                  onClick={() => onNavigate('complaints')}
                  className="px-3 py-1.5 bg-[#059669] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  + New Complaint
                </button>
              </div>

              <div className="space-y-3">
                {myComplaints.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[#0F284B]">{c.complaint_id}</span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {c.status}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-800">
                      Category: {c.category} ({c.severity})
                    </div>
                    <p className="text-slate-600">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 7: NOTIFICATIONS */}
          {activeSubTab === 'notifications' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Notification Center
              </h2>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
