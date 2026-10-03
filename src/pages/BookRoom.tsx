import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle,
  CreditCard,
  User,
  GraduationCap,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Shield,
  FileCheck,
  Building,
} from 'lucide-react';
import { Room, FoodPlan, HostelSettings } from '../types.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface BookRoomProps {
  rooms: Room[];
  foodPlans: FoodPlan[];
  settings: HostelSettings | null;
  preSelectedRoom: Room | null;
  onBookingComplete: (bookingId: string) => void;
  onNavigate: (tab: string) => void;
}

export const BookRoom: React.FC<BookRoomProps> = ({
  rooms,
  foodPlans,
  settings,
  preSelectedRoom,
  onBookingComplete,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedBooking, setCompletedBooking] = useState<any | null>(null);

  // Available rooms with beds > 0
  const availableRooms = rooms.filter((r) => r.status === 'AVAILABLE' && r.available_beds > 0);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: user?.full_name || '',
    guardianName: '',
    cnic: user?.cnic || '',
    dob: '2004-05-15',
    gender: 'Male',
    mobile: user?.phone || '+92 300 0000000',
    whatsapp: user?.phone || '+92 300 0000000',
    email: user?.email || '',
    permanentAddress: user?.address || 'House 12, Street 4, Lahore',

    // Step 2: Academic/Work
    occupation: 'Student',
    instituteName: 'NUST Islamabad',
    registrationNo: '2024-BSCS-101',

    // Step 3: Emergency Contact
    emergencyName: 'Muhammad Arshad',
    emergencyRelation: 'Father',
    emergencyPhone: '+92 300 1122334',

    // Step 4: Room & Stay
    selectedRoomId: preSelectedRoom ? preSelectedRoom.id : availableRooms[0]?.id || '',
    checkInDate: new Date().toISOString().split('T')[0],
    stayDurationMonths: 6,
    foodRequired: true,
    selectedFoodPlanId: foodPlans[0]?.id || 'fp_standard_full',

    // Step 6: Policies acceptance
    acceptedHostelPolicy: false,
    acceptedPaymentPolicy: false,
    acceptedCancellationPolicy: false,
    acceptedRefundPolicy: false,
    acceptedPrivacyPolicy: false,

    // Step 7: Payment
    paymentMethod: 'JAZZCASH',
    transactionId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    receiptImage: '',
  });

  useEffect(() => {
    if (preSelectedRoom) {
      setFormData((prev) => ({ ...prev, selectedRoomId: preSelectedRoom.id }));
    }
  }, [preSelectedRoom]);

  const selectedRoom = rooms.find((r) => r.id === formData.selectedRoomId);
  const selectedFoodPlan = foodPlans.find((p) => p.id === formData.selectedFoodPlanId);

  // Financial Calculations
  const roomRent = selectedRoom ? selectedRoom.monthly_rent : 0;
  const securityDeposit = selectedRoom ? selectedRoom.security_deposit : 0;
  const foodCharges = formData.foodRequired && selectedFoodPlan ? selectedFoodPlan.price_pkr : 0;
  const totalInitialPayment = roomRent + securityDeposit + foodCharges;

  // Validation per step
  const handleNext = () => {
    setErrorMsg(null);

    if (currentStep === 1) {
      if (!formData.fullName || !formData.guardianName || !formData.cnic || !formData.email || !formData.mobile) {
        setErrorMsg('Please fill out all required personal contact and CNIC fields.');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.instituteName || !formData.registrationNo) {
        setErrorMsg('Please provide your university, institute, or employer details.');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.emergencyName || !formData.emergencyPhone) {
        setErrorMsg('Emergency contact name and phone number are strictly required for security.');
        return;
      }
    } else if (currentStep === 4) {
      if (!selectedRoom) {
        setErrorMsg('Please select an available room.');
        return;
      }
      if (selectedRoom.available_beds <= 0) {
        setErrorMsg(`Room ${selectedRoom.room_number} is fully booked. Please select another room.`);
        return;
      }
    } else if (currentStep === 6) {
      if (
        !formData.acceptedHostelPolicy ||
        !formData.acceptedPaymentPolicy ||
        !formData.acceptedCancellationPolicy ||
        !formData.acceptedRefundPolicy ||
        !formData.acceptedPrivacyPolicy
      ) {
        setErrorMsg('You must review and accept all hostel terms and policies to proceed.');
        return;
      }
    }

    setCurrentStep((prev) => Math.min(7, prev + 1));
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Final Submission
  const handleSubmitBooking = async () => {
    if (!formData.transactionId) {
      setErrorMsg('Please provide the transaction ID / receipt reference of your payment.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Create booking
      const res = await api.createBooking({
        user_id: user?.id || `usr_temp_${Date.now()}`,
        user_name: formData.fullName,
        user_email: formData.email,
        user_phone: formData.mobile,
        user_cnic: formData.cnic,
        room_id: selectedRoom!.id,
        room_number: selectedRoom!.room_number,
        seater_count: selectedRoom!.seater_count,
        check_in_date: formData.checkInDate,
        stay_duration_months: Number(formData.stayDurationMonths),
        food_required: formData.foodRequired,
        food_plan_id: formData.foodRequired ? formData.selectedFoodPlanId : undefined,
        total_initial_payment: totalInitialPayment,
        rent_amount: roomRent,
        security_deposit: securityDeposit,
        food_charges: foodCharges,
        other_charges: 0,
        guardian_name: formData.guardianName,
        institute_name: formData.instituteName,
        registration_no: formData.registrationNo,
        emergency_name: formData.emergencyName,
        emergency_relation: formData.emergencyRelation,
        emergency_phone: formData.emergencyPhone,
      });

      // 2. Submit payment record
      await api.submitPayment({
        booking_id: res.booking.booking_id,
        user_id: res.booking.user_id,
        user_name: formData.fullName,
        amount: totalInitialPayment,
        payment_method: formData.paymentMethod,
        transaction_id: formData.transactionId,
        payment_date: formData.paymentDate,
        receipt_image: formData.receiptImage || undefined,
      });

      setCompletedBooking(res.booking);
      onBookingComplete(res.booking.booking_id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedBooking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-[#0F284B]">Booking Request Submitted!</h1>
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-left space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <span className="text-xs text-slate-500 font-bold">Booking Reference ID:</span>
            <span className="text-base font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              {completedBooking.booking_id}
            </span>
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <div>
              <strong>Resident Name:</strong> {completedBooking.user_name}
            </div>
            <div>
              <strong>Room Allocated:</strong> Room #{completedBooking.room_number} (
              {completedBooking.seater_count}-Seater)
            </div>
            <div>
              <strong>Total Initial Payable:</strong> PKR{' '}
              {completedBooking.total_initial_payment.toLocaleString()}
            </div>
            <div>
              <strong>Payment Status:</strong> Verification Pending (Manual Admin Check)
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
          Our hostel administrator has received your transaction details. Once verified in the bank
          ledger, your bed will be locked and an official confirmation invoice issued.
        </p>

        <div className="flex justify-center gap-3 pt-4">
          <button
            onClick={() => onNavigate('resident-dashboard')}
            className="px-6 py-2.5 bg-[#0F284B] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Go to Resident Dashboard
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Personal' },
    { num: 2, label: 'Academic' },
    { num: 3, label: 'Emergency' },
    { num: 4, label: 'Room' },
    { num: 5, label: 'Summary' },
    { num: 6, label: 'Policies' },
    { num: 7, label: 'Payment' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-[#0F284B] tracking-tight">
          Hostel Room Online Booking
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Complete the 7-step verified admission application for {settings?.hostel_name || 'Hostel'}.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between overflow-x-auto pb-2 border-b border-slate-200">
        {steps.map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-1.5 px-2 py-1 text-xs font-bold whitespace-nowrap ${
              currentStep === s.num
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : currentStep > s.num
                ? 'text-slate-700'
                : 'text-slate-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep === s.num
                  ? 'bg-emerald-600 text-white'
                  : currentStep > s.num
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {s.num}
            </span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {/* STEP 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 1: Resident Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ali Hamza"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Father / Guardian Name *
                </label>
                <input
                  type="text"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="e.g. Muhammad Hamza"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  CNIC / B-Form Number *
                </label>
                <input
                  type="text"
                  value={formData.cnic}
                  onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                  placeholder="35201-XXXXXXX-X"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="resident@email.com"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Permanent Home Address (as on CNIC) *
                </label>
                <textarea
                  rows={2}
                  value={formData.permanentAddress}
                  onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                  placeholder="City, District, Complete Street Address..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Academic/Work Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 2: Academic / Professional Background
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Resident Category
                </label>
                <select
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white"
                >
                  <option value="Student">University / College Student</option>
                  <option value="Professional">Working Professional / Employee</option>
                  <option value="Exam Prep">CSS / PMS / Entry Test Aspirant</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  University / Institute / Company Name *
                </label>
                <input
                  type="text"
                  value={formData.instituteName}
                  onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                  placeholder="e.g. NUST / FAST / COMSATS / Shifa Medical"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Registration / Roll / Employee ID *
                </label>
                <input
                  type="text"
                  value={formData.registrationNo}
                  onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                  placeholder="e.g. 2024-NUST-CS-089"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Emergency Contact */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 3: Emergency Guardian Contact
            </h3>
            <p className="text-xs text-slate-500">
              Hostel policy mandates valid parental/guardian contact details for medical
              emergencies and curfew notifications.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  placeholder="e.g. Muhammad Arshad"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Relationship *
                </label>
                <input
                  type="text"
                  value={formData.emergencyRelation}
                  onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                  placeholder="Father / Brother / Guardian"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Emergency Phone Number *
                </label>
                <input
                  type="text"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="+92 300 0000000"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Room & Stay Selection */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 4: Select Room &amp; Food Plan
            </h3>

            {/* Room Picker */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Choose Room (Available Rooms Only)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableRooms.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setFormData({ ...formData, selectedRoomId: r.id })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      formData.selectedRoomId === r.id
                        ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        Room #{r.room_number} ({r.seater_count}-Seater)
                      </div>
                      <div className="text-xs text-slate-500">
                        Floor {r.floor} • {r.available_beds} Bed Available
                      </div>
                      <div className="text-xs font-extrabold text-[#0F284B] mt-1">
                        Rs. {r.monthly_rent.toLocaleString()} / mo
                      </div>
                    </div>
                    {formData.selectedRoomId === r.id && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Expected Check-in Date
                </label>
                <input
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Stay Duration (Months)
                </label>
                <select
                  value={formData.stayDurationMonths}
                  onChange={(e) =>
                    setFormData({ ...formData, stayDurationMonths: Number(e.target.value) })
                  }
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white"
                >
                  <option value={1}>1 Month</option>
                  <option value={3}>3 Months (Semester Trim)</option>
                  <option value={6}>6 Months (Full Semester)</option>
                  <option value={12}>12 Months (Full Academic Year)</option>
                </select>
              </div>
            </div>

            {/* Food Package Option */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">
                    Include Mess / Meal Plan
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Food fee is separate from room rent as per hostel rules.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.foodRequired}
                  onChange={(e) => setFormData({ ...formData, foodRequired: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>

              {formData.foodRequired && (
                <div className="pt-2 border-t border-slate-200">
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Select Meal Plan
                  </label>
                  <select
                    value={formData.selectedFoodPlanId}
                    onChange={(e) =>
                      setFormData({ ...formData, selectedFoodPlanId: e.target.value })
                    }
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white"
                  >
                    {foodPlans.map((fp) => (
                      <option key={fp.id} value={fp.id}>
                        {fp.name} - PKR {fp.price_pkr.toLocaleString()}/mo
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Booking Summary */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 5: Verified Payment Breakdown
            </h3>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-600">Selected Accommodation:</span>
                <span className="font-bold text-slate-900">
                  Room #{selectedRoom?.room_number} ({selectedRoom?.seater_count}-Seater, Floor{' '}
                  {selectedRoom?.floor})
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-t border-slate-200">
                <span className="text-slate-600">First Month Room Rent:</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  PKR {roomRent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-t border-slate-200">
                <span className="text-slate-600">Security Deposit (100% Refundable):</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  PKR {securityDeposit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-t border-slate-200">
                <span className="text-slate-600">
                  Food Plan Charges ({formData.foodRequired ? selectedFoodPlan?.name : 'No Mess Plan'}):
                </span>
                <span className="font-bold text-slate-900 tabular-nums">
                  PKR {foodCharges.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-t border-slate-200">
                <span className="text-slate-600">Registration / Maintenance Fee:</span>
                <span className="font-bold text-emerald-700">WAIVED (Rs. 0)</span>
              </div>

              <div className="flex justify-between items-center text-sm font-black text-[#0F284B] pt-3 border-t-2 border-slate-300">
                <span>Total Initial Due at Admission:</span>
                <span className="text-xl tabular-nums text-[#059669]">
                  PKR {totalInitialPayment.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              * Note: The security deposit will be refunded in full upon completion of stay and
              return of inventory, subject to standard 30-day prior written notice.
            </p>
          </div>
        )}

        {/* STEP 6: Policy Agreements */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 6: Hostel Regulation Agreements
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Please review and check each policy acknowledgment before submitting your payment:
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptedHostelPolicy}
                  onChange={(e) =>
                    setFormData({ ...formData, acceptedHostelPolicy: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded"
                />
                <div className="text-xs text-slate-700">
                  <span className="font-bold block text-slate-900">Hostel Rules &amp; Curfew Policy</span>
                  I agree to observe the 10:00 PM gate curfew, quiet study hours, and zero-tolerance
                  policy regarding weapons, harassment, and smoking.
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptedPaymentPolicy}
                  onChange={(e) =>
                    setFormData({ ...formData, acceptedPaymentPolicy: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded"
                />
                <div className="text-xs text-slate-700">
                  <span className="font-bold block text-slate-900">Monthly Rent Payment Terms</span>
                  I agree to submit monthly dues by the 5th of every month through the online portal
                  or designated bank accounts.
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptedCancellationPolicy}
                  onChange={(e) =>
                    setFormData({ ...formData, acceptedCancellationPolicy: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded"
                />
                <div className="text-xs text-slate-700">
                  <span className="font-bold block text-slate-900">Cancellation &amp; Notice Period</span>
                  I agree to provide at least 30 days formal checkout notice prior to moving out.
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptedRefundPolicy}
                  onChange={(e) =>
                    setFormData({ ...formData, acceptedRefundPolicy: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded"
                />
                <div className="text-xs text-slate-700">
                  <span className="font-bold block text-slate-900">Security Deposit Refund Policy</span>
                  I understand that security deposits are returned via bank transfer within 5 days of
                  inventory clearance.
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptedPrivacyPolicy}
                  onChange={(e) =>
                    setFormData({ ...formData, acceptedPrivacyPolicy: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded"
                />
                <div className="text-xs text-slate-700">
                  <span className="font-bold block text-slate-900">CNIC &amp; Police Verification Privacy</span>
                  I certify that the information provided is accurate and consent to mandatory local
                  police tenant registration.
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 7: Payment Details */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 7: Manual Payment Verification
            </h3>

            {/* Total Payable Box */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-800">Amount to Deposit:</div>
                <div className="text-2xl font-black text-emerald-900 tabular-nums">
                  PKR {totalInitialPayment.toLocaleString()}
                </div>
              </div>
              <span className="text-xs bg-emerald-200 text-emerald-900 font-bold px-2.5 py-1 rounded">
                Initial Admission Dues
              </span>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Select Payment Channel:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'JAZZCASH', label: 'JazzCash Mobile Account' },
                  { id: 'EASYPAISA', label: 'Easypaisa Account' },
                  { id: 'BANK_TRANSFER', label: 'Direct Bank Transfer / IBAN' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: pm.id as any })}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                      formData.paymentMethod === pm.id
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Instructions according to selected method */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 block">
                Official Account Deposit Instructions:
              </span>
              {formData.paymentMethod === 'JAZZCASH' && (
                <div className="space-y-1 text-slate-700">
                  <div>
                    <strong>Account Title:</strong>{' '}
                    {settings?.jazzcash_title || 'Al-Madina Hostel Operations'}
                  </div>
                  <div>
                    <strong>JazzCash Mobile Number:</strong>{' '}
                    <span className="font-mono font-bold text-[#0F284B]">
                      {settings?.jazzcash_number || '0300-1234567'}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Send money via JazzCash App or dial *786#. Keep transaction ID ready.
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'EASYPAISA' && (
                <div className="space-y-1 text-slate-700">
                  <div>
                    <strong>Account Title:</strong>{' '}
                    {settings?.easypaisa_title || 'Al-Madina Hostel Management'}
                  </div>
                  <div>
                    <strong>Easypaisa Mobile Number:</strong>{' '}
                    <span className="font-mono font-bold text-[#0F284B]">
                      {settings?.easypaisa_number || '0321-7654321'}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Send via Easypaisa App or retail agent. Retain SMS receipt for verification.
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'BANK_TRANSFER' && (
                <div className="space-y-1 text-slate-700">
                  <div>
                    <strong>Bank Name:</strong>{' '}
                    {settings?.bank_name || 'Meezan Bank Limited, Islamic Banking'}
                  </div>
                  <div>
                    <strong>Account Title:</strong>{' '}
                    {settings?.bank_account_title || 'Al-Madina Hostel Services'}
                  </div>
                  <div>
                    <strong>IBAN:</strong>{' '}
                    <span className="font-mono font-bold text-[#0F284B]">
                      {settings?.bank_iban || 'PK45MEZN0001020304050607'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submission Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Bank / JazzCash / Easypaisa Transaction ID *
                </label>
                <input
                  type="text"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  placeholder="e.g. JC-98284726 or Bank Ref# 001928"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Receipt Reference Note / Screenshot Details
                </label>
                <input
                  type="text"
                  value={formData.receiptImage}
                  onChange={(e) => setFormData({ ...formData, receiptImage: e.target.value })}
                  placeholder="Optional: Deposit branch name or sender account number for faster ledger match"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
              <strong>Important:</strong> Uploading receipt details does NOT automatically mark your
              dues as verified. Management checks the bank statement prior to final confirmation.
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] rounded-xl shadow-xs transition"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitBooking}
              className="flex items-center gap-2 px-8 py-3 text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] rounded-xl shadow-md transition disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying & Submitting...' : 'Confirm & Submit Booking'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
