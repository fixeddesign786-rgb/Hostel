import express from 'express';
import { db, verifyPassword } from './db.ts';

export const router = express.Router();

// Helper to simulate current authenticated user from header
function getAuthUser(req: express.Request) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = db.findUserById(token);
    if (user) return user;
  }
  // Fallback demo user
  const emailHeader = req.headers['x-user-email'] as string;
  if (emailHeader) {
    const user = db.findUserByEmail(emailHeader);
    if (user) return user;
  }
  return null;
}

// ----------------- AUTH -----------------
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user || !user.password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (!verifyPassword(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const { password: _, ...userWithoutPass } = user;
  db.logAudit(user.id, user.full_name, user.role, 'USER_LOGIN', `User logged in from ${req.ip || 'web'}`);
  return res.json({ user: userWithoutPass, token: user.id });
});

router.post('/auth/register', (req, res) => {
  const { full_name, email, password, phone, cnic, address } = req.body;
  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'Full name, email, and password are required.' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'Email is already registered.' });
  }

  const newUser = db.createUser({
    full_name,
    email,
    password,
    role: 'STUDENT',
    phone: phone || '',
    cnic: cnic || '',
    address: address || '',
    status: 'ACTIVE',
  });

  const { password: _, ...cleanUser } = newUser;
  db.logAudit(newUser.id, newUser.full_name, newUser.role, 'USER_REGISTER', 'New resident account registered.');
  return res.status(201).json({ user: cleanUser, token: newUser.id });
});

router.get('/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const { password: _, ...clean } = user;
  return res.json({ user: clean });
});

// ----------------- ROOMS -----------------
router.get('/rooms', (req, res) => {
  const rooms = db.getRooms();
  return res.json({ rooms });
});

router.get('/rooms/:id', (req, res) => {
  const room = db.getRoomById(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  return res.json({ room });
});

router.post('/rooms', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Admin', role: 'SUPER_ADMIN' };
  try {
    const room = db.addRoom(req.body, { id: user.id, name: user.full_name, role: user.role });
    return res.status(201).json({ room });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/rooms/:id', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Admin', role: 'SUPER_ADMIN' };
  const room = db.updateRoom(req.params.id, req.body, { id: user.id, name: user.full_name, role: user.role });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  return res.json({ room });
});

router.delete('/rooms/:id', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Admin', role: 'SUPER_ADMIN' };
  try {
    const ok = db.deleteRoom(req.params.id, { id: user.id, name: user.full_name, role: user.role });
    if (!ok) return res.status(404).json({ error: 'Room not found' });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// ----------------- BOOKINGS -----------------
router.get('/bookings', (req, res) => {
  const user = getAuthUser(req);
  const allBookings = db.getBookings();

  // If student, filter by user id
  if (user && user.role === 'STUDENT') {
    return res.json({ bookings: allBookings.filter((b) => b.user_id === user.id || b.user_email === user.email) });
  }
  return res.json({ bookings: allBookings });
});

router.get('/bookings/:id', (req, res) => {
  const booking = db.getBookingById(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  return res.json({ booking });
});

router.post('/bookings', (req, res) => {
  try {
    const booking = db.createBooking(req.body);
    return res.status(201).json({ booking });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.patch('/bookings/:id/status', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Admin', role: 'HOSTEL_ADMIN' };
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  const updated = db.updateBookingStatus(req.params.id, status, {
    id: user.id,
    name: user.full_name,
    role: user.role,
  });

  if (!updated) return res.status(404).json({ error: 'Booking not found' });
  return res.json({ booking: updated });
});

// ----------------- PAYMENTS -----------------
router.get('/payments', (req, res) => {
  const user = getAuthUser(req);
  const payments = db.getPayments();
  if (user && user.role === 'STUDENT') {
    return res.json({ payments: payments.filter((p) => p.user_id === user.id) });
  }
  return res.json({ payments });
});

router.post('/payments', (req, res) => {
  try {
    const payment = db.submitPayment(req.body);
    return res.status(201).json({ payment });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.post('/payments/:id/verify', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Admin Manager', role: 'HOSTEL_ADMIN' };
  const payment = db.verifyPayment(req.params.id, {
    id: user.id,
    name: user.full_name,
    role: user.role,
  });
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  return res.json({ payment });
});

router.post('/payments/:id/reject', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Admin Manager', role: 'HOSTEL_ADMIN' };
  const { reason } = req.body;
  const payment = db.rejectPayment(req.params.id, reason || 'Transaction could not be verified in bank ledger.', {
    id: user.id,
    name: user.full_name,
    role: user.role,
  });
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  return res.json({ payment });
});

// ----------------- INVOICES -----------------
router.get('/invoices', (req, res) => {
  const user = getAuthUser(req);
  const raw = db.getRawData().invoices;
  if (user && user.role === 'STUDENT') {
    return res.json({ invoices: raw.filter((i) => i.user_id === user.id) });
  }
  return res.json({ invoices: raw });
});

// ----------------- RESIDENTS -----------------
router.get('/residents', (req, res) => {
  const residents = db.getRawData().residents;
  return res.json({ residents });
});

// ----------------- FACILITIES -----------------
router.get('/facilities', (req, res) => {
  const all = db.getFacilities();
  const isAdmin = req.query.admin === 'true';
  if (isAdmin) {
    return res.json({ facilities: all });
  }
  // Public only sees enabled facilities!
  return res.json({ facilities: all.filter((f) => f.is_enabled) });
});

router.patch('/facilities/:id/toggle', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Admin', role: 'HOSTEL_ADMIN' };
  const { is_enabled } = req.body;
  const fac = db.toggleFacility(req.params.id, is_enabled, {
    id: user.id,
    name: user.full_name,
    role: user.role,
  });
  if (!fac) return res.status(404).json({ error: 'Facility not found' });
  return res.json({ facility: fac });
});

router.put('/facilities/:id', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Admin', role: 'HOSTEL_ADMIN' };
  const fac = db.updateFacility(req.params.id, req.body, {
    id: user.id,
    name: user.full_name,
    role: user.role,
  });
  if (!fac) return res.status(404).json({ error: 'Facility not found' });
  return res.json({ facility: fac });
});

// ----------------- FOOD -----------------
router.get('/food', (req, res) => {
  const foodPlans = db.getFoodPlans();
  return res.json({ foodPlans });
});

router.put('/food/:id', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Admin', role: 'HOSTEL_ADMIN' };
  const updated = db.updateFoodPlan(req.params.id, req.body, {
    id: user.id,
    name: user.full_name,
    role: user.role,
  });
  if (!updated) return res.status(404).json({ error: 'Food plan not found' });
  return res.json({ foodPlan: updated });
});

// ----------------- POLICIES -----------------
router.get('/policies', (req, res) => {
  const policies = db.getPolicies();
  return res.json({ policies });
});

router.put('/policies/:id', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Admin', role: 'HOSTEL_ADMIN' };
  const updated = db.updatePolicy(req.params.id, req.body, {
    id: user.id,
    name: user.full_name,
    role: user.role,
  });
  if (!updated) return res.status(404).json({ error: 'Policy not found' });
  return res.json({ policy: updated });
});

// ----------------- GALLERY -----------------
router.get('/gallery', (req, res) => {
  const gallery = db.getGallery();
  return res.json({ gallery });
});

router.post('/gallery', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Admin', role: 'HOSTEL_ADMIN' };
  const item = db.addGalleryItem(req.body, { id: user.id, name: user.full_name, role: user.role });
  return res.status(201).json({ item });
});

router.delete('/gallery/:id', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Admin', role: 'HOSTEL_ADMIN' };
  db.deleteGalleryItem(req.params.id, { id: user.id, name: user.full_name, role: user.role });
  return res.json({ success: true });
});

// ----------------- COMPLAINTS -----------------
router.get('/complaints', (req, res) => {
  const user = getAuthUser(req);
  const all = db.getComplaints();
  if (user && user.role === 'STUDENT') {
    return res.json({ complaints: all.filter((c) => c.user_id === user.id) });
  }
  return res.json({ complaints: all });
});

router.post('/complaints', (req, res) => {
  try {
    const complaint = db.createComplaint(req.body);
    return res.status(201).json({ complaint });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.patch('/complaints/:id', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Warden Staff', role: 'STAFF' };
  const updated = db.updateComplaintStatus(req.params.id, req.body, {
    id: user.id,
    name: user.full_name,
    role: user.role,
  });
  if (!updated) return res.status(404).json({ error: 'Complaint not found' });
  return res.json({ complaint: updated });
});

// ----------------- POLICE ESCALATIONS -----------------
router.get('/police', (req, res) => {
  const escalations = db.getPoliceEscalations();
  return res.json({ escalations });
});

router.post('/police', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Security Admin', role: 'SECURITY' };
  const { complaint_id, police_jurisdiction, police_station, official_contact, official_complaint_portal, notes } = req.body;
  try {
    const esc = db.createPoliceEscalation(
      complaint_id,
      { police_jurisdiction, police_station, official_contact, official_complaint_portal, notes },
      { id: user.id, name: user.full_name, role: user.role }
    );
    return res.status(201).json({ escalation: esc });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.patch('/police/:id', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Security Admin', role: 'SECURITY' };
  const updated = db.updatePoliceEscalation(req.params.id, req.body, {
    id: user.id,
    name: user.full_name,
    role: user.role,
  });
  if (!updated) return res.status(404).json({ error: 'Escalation record not found' });
  return res.json({ escalation: updated });
});

// ----------------- EMERGENCY -----------------
router.get('/emergency', (req, res) => {
  const contacts = db.getEmergencyContacts();
  const settings = db.getSettings();
  return res.json({ contacts, settings });
});

// ----------------- NOTIFICATIONS -----------------
router.get('/notifications', (req, res) => {
  const user = getAuthUser(req);
  const list = db.getNotifications(user ? user.id : undefined);
  return res.json({ notifications: list });
});

router.patch('/notifications/:id/read', (req, res) => {
  const notif = db.markNotificationRead(req.params.id);
  return res.json({ notification: notif });
});

// ----------------- CONTACT -----------------
router.post('/contact', (req, res) => {
  const msg = db.addContactMessage(req.body);
  return res.status(201).json({ message: msg });
});

// ----------------- SETTINGS -----------------
router.get('/settings', (req, res) => {
  const settings = db.getSettings();
  return res.json({ settings });
});

router.put('/settings', (req, res) => {
  const user = getAuthUser(req) || { id: 'admin', full_name: 'Super Admin', role: 'SUPER_ADMIN' };
  const updated = db.updateSettings(req.body, { id: user.id, name: user.full_name, role: user.role });
  return res.json({ settings: updated });
});

// ----------------- AUDIT LOGS -----------------
router.get('/audit-logs', (req, res) => {
  const logs = db.getRawData().audit_logs;
  return res.json({ logs });
});

// ----------------- DASHBOARD STATS -----------------
router.get('/stats', (req, res) => {
  const raw = db.getRawData();
  const totalRooms = raw.rooms.length;
  const availableRooms = raw.rooms.filter((r) => r.status === 'AVAILABLE').length;
  const occupiedRooms = raw.rooms.filter((r) => r.status === 'OCCUPIED').length;
  const maintenanceRooms = raw.rooms.filter((r) => r.status === 'MAINTENANCE').length;
  const totalResidents = raw.residents.filter((r) => r.status === 'ACTIVE').length;
  const pendingBookings = raw.bookings.filter((b) => b.status === 'PENDING' || b.status === 'PAYMENT PENDING').length;
  const confirmedBookings = raw.bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'CHECKED-IN').length;
  const pendingPayments = raw.payments.filter((p) => p.status === 'VERIFICATION PENDING').length;
  const verifiedPayments = raw.payments.filter((p) => p.status === 'VERIFIED').length;
  const totalRevenue = raw.payments
    .filter((p) => p.status === 'VERIFIED')
    .reduce((sum, p) => sum + p.amount, 0);

  const openComplaints = raw.complaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const seriousComplaints = raw.complaints.filter((c) => (c.severity === 'SERIOUS' || c.severity === 'EMERGENCY') && c.status !== 'Closed').length;
  const policeEscalations = raw.police_escalations.length;

  return res.json({
    stats: {
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      totalResidents,
      pendingBookings,
      confirmedBookings,
      pendingPayments,
      verifiedPayments,
      totalRevenue,
      openComplaints,
      seriousComplaints,
      policeEscalations,
    },
  });
});
