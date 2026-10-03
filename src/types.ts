export type UserRole = 'SUPER_ADMIN' | 'HOSTEL_ADMIN' | 'MANAGER' | 'STAFF' | 'SECURITY' | 'STUDENT';

export interface User {
  id: string;
  full_name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone: string;
  cnic: string;
  address: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  created_at: string;
}

export interface RoomType {
  id: string;
  name: string;
  seater_count: number;
  default_rent: number;
  default_deposit: number;
  description: string;
}

export type RoomStatus = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE' | 'UNAVAILABLE';

export interface Room {
  id: string;
  room_number: string;
  room_type_id: string;
  seater_count: number;
  floor: number;
  capacity: number;
  monthly_rent: number;
  security_deposit: number;
  available_beds: number;
  facilities: string[];
  status: RoomStatus;
  images: string[];
  rules: string[];
  description: string;
}

export type BookingStatus =
  | 'PENDING'
  | 'PAYMENT PENDING'
  | 'VERIFICATION'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'CHECKED-IN'
  | 'CHECKED-OUT';

export interface Booking {
  id: string;
  booking_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_cnic: string;
  room_id: string;
  room_number: string;
  seater_count: number;
  check_in_date: string;
  stay_duration_months: number;
  food_required: boolean;
  food_plan_id?: string;
  status: BookingStatus;
  total_initial_payment: number;
  rent_amount: number;
  security_deposit: number;
  food_charges: number;
  other_charges: number;
  guardian_name: string;
  institute_name: string;
  registration_no: string;
  emergency_name: string;
  emergency_relation: string;
  emergency_phone: string;
  created_at: string;
}

export type PaymentMethod = 'JAZZCASH' | 'EASYPAISA' | 'BANK_TRANSFER' | 'CASH';

export type PaymentStatus =
  | 'UNPAID'
  | 'PAYMENT SUBMITTED'
  | 'VERIFICATION PENDING'
  | 'VERIFIED'
  | 'FAILED'
  | 'REFUNDED';

export interface Payment {
  id: string;
  payment_id: string;
  booking_id: string;
  user_id: string;
  user_name: string;
  amount: number;
  payment_method: PaymentMethod;
  transaction_id: string;
  payment_date: string;
  receipt_image?: string;
  status: PaymentStatus;
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  user_id: string;
  user_name: string;
  booking_id: string;
  payment_id?: string;
  issue_date: string;
  due_date: string;
  room_rent: number;
  security_deposit: number;
  food_charges: number;
  other_charges: number;
  total_amount: number;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
}

export interface Resident {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  cnic: string;
  room_id: string;
  room_number: string;
  bed_number: number;
  check_in_date: string;
  check_out_date?: string;
  status: 'ACTIVE' | 'TEMPORARY_LEAVE' | 'CHECKED_OUT';
  emergency_contact: {
    name: string;
    relation: string;
    phone: string;
  };
  notes?: string;
}

export type ComplaintSeverity = 'NORMAL' | 'SERIOUS' | 'EMERGENCY';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'In Progress'
  | 'Escalated'
  | 'Resolved'
  | 'Closed';

export interface ComplaintUpdate {
  timestamp: string;
  note: string;
  author: string;
}

export interface Complaint {
  id: string;
  complaint_id: string;
  user_id: string;
  user_name: string;
  room_number: string;
  phone: string;
  category: string;
  severity: ComplaintSeverity;
  description: string;
  incident_date: string;
  incident_location: string;
  evidence_url?: string;
  status: ComplaintStatus;
  assigned_to?: string;
  internal_notes: string[];
  resident_updates: ComplaintUpdate[];
  is_confidential: boolean;
  police_escalation_id?: string;
  created_at: string;
  updated_at: string;
}

export type PoliceEscalationStatus =
  | 'REQUESTED'
  | 'SUBMITTED'
  | 'RECEIVED'
  | 'FORWARDED'
  | 'UNDER INVESTIGATION'
  | 'ACTION TAKEN'
  | 'RESOLVED'
  | 'CLOSED';

export interface PoliceStatusLog {
  timestamp: string;
  status: PoliceEscalationStatus;
  note: string;
  updated_by: string;
}

export interface PoliceEscalation {
  id: string;
  complaint_id: string;
  complainant_name: string;
  room_number: string;
  category: string;
  severity: ComplaintSeverity;
  incident_date: string;
  incident_details: string;
  police_jurisdiction: string;
  police_station: string;
  official_contact: string;
  official_complaint_portal: string;
  police_reference_number?: string;
  escalation_status: PoliceEscalationStatus;
  submission_date?: string;
  officer_name?: string;
  notes?: string;
  status_history: PoliceStatusLog[];
  created_at: string;
  updated_at: string;
}

export interface Facility {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  is_enabled: boolean;
  icon_name: string;
  highlight: string;
}

export interface FoodPlan {
  id: string;
  name: string;
  timing: string;
  price_pkr: number;
  menu_summary: string;
  menu_schedule: Record<string, string>;
  rules: string[];
  is_active: boolean;
}

export interface HostelPolicy {
  id: string;
  category: string;
  title: string;
  items: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Exterior' | 'Rooms' | 'Food' | 'Kitchen' | 'Study Area' | 'Common Area' | 'Facilities' | 'Location';
  image_url: string;
  description: string;
}

export interface EmergencyContact {
  id: string;
  title: string;
  service_type: string;
  phone_number: string;
  alternate_phone?: string;
  address: string;
  is_primary: boolean;
  description: string;
}

export interface NotificationItem {
  id: string;
  user_id: string; // user id or 'ALL' or 'ADMIN'
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'emergency';
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED';
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface HostelSettings {
  hostel_name: string;
  tagline: string;
  slogan: string;
  complete_address: string;
  city: string;
  district: string;
  province: string;
  country: string;
  phone: string;
  whatsapp: string;
  email: string;
  curfew_time: string;
  jazzcash_title: string;
  jazzcash_number: string;
  easypaisa_title: string;
  easypaisa_number: string;
  bank_name: string;
  bank_account_title: string;
  bank_iban: string;
  police_station_name: string;
  police_jurisdiction: string;
  police_helpline: string;
  police_station_phone: string;
  police_complaint_portal: string;
  emergency_helpline_1122: string;
  hostel_emergency_contact: string;
  map_embed_query: string;
  latitude: number;
  longitude: number;
}
