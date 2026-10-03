import {
  Room,
  Booking,
  Payment,
  Invoice,
  Resident,
  Complaint,
  PoliceEscalation,
  Facility,
  FoodPlan,
  HostelPolicy,
  GalleryItem,
  EmergencyContact,
  NotificationItem,
  HostelSettings,
  User,
} from '../types.ts';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('hostel_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: (credentials: { email: string; password?: string }) =>
    request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: any) =>
    request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => request<{ user: User }>('/auth/me'),

  // Rooms
  getRooms: () => request<{ rooms: Room[] }>('/rooms'),
  getRoomById: (id: string) => request<{ room: Room }>(`/rooms/${id}`),
  createRoom: (data: Partial<Room>) =>
    request<{ room: Room }>('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateRoom: (id: string, data: Partial<Room>) =>
    request<{ room: Room }>(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteRoom: (id: string) =>
    request<{ success: boolean }>(`/rooms/${id}`, {
      method: 'DELETE',
    }),

  // Bookings
  getBookings: () => request<{ bookings: Booking[] }>('/bookings'),
  getBookingById: (id: string) => request<{ booking: Booking }>(`/bookings/${id}`),
  createBooking: (data: any) =>
    request<{ booking: Booking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateBookingStatus: (id: string, status: string) =>
    request<{ booking: Booking }>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Payments
  getPayments: () => request<{ payments: Payment[] }>('/payments'),
  submitPayment: (data: any) =>
    request<{ payment: Payment }>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verifyPayment: (id: string) =>
    request<{ payment: Payment }>(`/payments/${id}/verify`, {
      method: 'POST',
    }),
  rejectPayment: (id: string, reason: string) =>
    request<{ payment: Payment }>(`/payments/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Invoices & Residents
  getInvoices: () => request<{ invoices: Invoice[] }>('/invoices'),
  getResidents: () => request<{ residents: Resident[] }>('/residents'),

  // Facilities
  getFacilities: (admin = false) =>
    request<{ facilities: Facility[] }>(`/facilities${admin ? '?admin=true' : ''}`),
  toggleFacility: (id: string, is_enabled: boolean) =>
    request<{ facility: Facility }>(`/facilities/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ is_enabled }),
    }),
  updateFacility: (id: string, data: Partial<Facility>) =>
    request<{ facility: Facility }>(`/facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Food
  getFoodPlans: () => request<{ foodPlans: FoodPlan[] }>('/food'),
  updateFoodPlan: (id: string, data: Partial<FoodPlan>) =>
    request<{ foodPlan: FoodPlan }>(`/food/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Policies
  getPolicies: () => request<{ policies: HostelPolicy[] }>('/policies'),
  updatePolicy: (id: string, data: Partial<HostelPolicy>) =>
    request<{ policy: HostelPolicy }>(`/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Gallery
  getGallery: () => request<{ gallery: GalleryItem[] }>('/gallery'),
  addGalleryItem: (data: Partial<GalleryItem>) =>
    request<{ item: GalleryItem }>('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteGalleryItem: (id: string) =>
    request<{ success: boolean }>(`/gallery/${id}`, {
      method: 'DELETE',
    }),

  // Complaints
  getComplaints: () => request<{ complaints: Complaint[] }>('/complaints'),
  createComplaint: (data: any) =>
    request<{ complaint: Complaint }>('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateComplaint: (id: string, updates: any) =>
    request<{ complaint: Complaint }>(`/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  // Police Escalations
  getPoliceEscalations: () => request<{ escalations: PoliceEscalation[] }>('/police'),
  createPoliceEscalation: (data: any) =>
    request<{ escalation: PoliceEscalation }>('/police', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePoliceEscalation: (id: string, updates: any) =>
    request<{ escalation: PoliceEscalation }>(`/police/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  // Emergency & Notifications & Settings
  getEmergency: () =>
    request<{ contacts: EmergencyContact[]; settings: HostelSettings }>('/emergency'),
  getNotifications: () =>
    request<{ notifications: NotificationItem[] }>('/notifications'),
  markNotificationRead: (id: string) =>
    request<{ notification: NotificationItem }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),
  getSettings: () => request<{ settings: HostelSettings }>('/settings'),
  updateSettings: (data: Partial<HostelSettings>) =>
    request<{ settings: HostelSettings }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  sendContactMessage: (data: any) =>
    request<{ message: any }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAuditLogs: () => request<{ logs: any[] }>('/audit-logs'),
  getStats: () => request<{ stats: any }>('/stats'),
};
