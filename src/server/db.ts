import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  Room,
  RoomType,
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
  ContactMessage,
  AuditLog,
  HostelSettings,
} from '../types.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'hostel_db.json');

export interface DatabaseSchema {
  users: User[];
  room_types: RoomType[];
  rooms: Room[];
  bookings: Booking[];
  payments: Payment[];
  invoices: Invoice[];
  residents: Resident[];
  complaints: Complaint[];
  police_escalations: PoliceEscalation[];
  facilities: Facility[];
  food_plans: FoodPlan[];
  hostel_policies: HostelPolicy[];
  gallery: GalleryItem[];
  emergency_contacts: EmergencyContact[];
  notifications: NotificationItem[];
  contact_messages: ContactMessage[];
  audit_logs: AuditLog[];
  settings: HostelSettings;
}

export function hashPassword(plain: string): string {
  return crypto.createHash('sha256').update(plain + 'salt_hostel_pakistan_2026').digest('hex');
}

export function verifyPassword(plain: string, hash: string): boolean {
  return hashPassword(plain) === hash;
}

// Initial Demo Seed Data
function getInitialSeedData(): DatabaseSchema {
  const adminPassHash = hashPassword('Admin@123');
  const studentPassHash = hashPassword('Student@123');

  const users: User[] = [
    {
      id: 'usr_super_admin',
      full_name: 'Muhammad Tariq Khan',
      email: 'admin@hostelportal.pk',
      password: adminPassHash,
      role: 'SUPER_ADMIN',
      phone: '+92 300 1234567',
      cnic: '35201-1234567-1',
      address: 'Hostel Executive Office, Sector H-12, Islamabad',
      status: 'ACTIVE',
      created_at: new Date('2026-01-01').toISOString(),
    },
    {
      id: 'usr_hostel_manager',
      full_name: 'Ahmed Raza Siddiqui',
      email: 'manager@hostelportal.pk',
      password: adminPassHash,
      role: 'HOSTEL_ADMIN',
      phone: '+92 321 7654321',
      cnic: '37405-7654321-3',
      address: 'Staff Block, Hostel Premises, Islamabad',
      status: 'ACTIVE',
      created_at: new Date('2026-01-05').toISOString(),
    },
    {
      id: 'usr_security_head',
      full_name: 'Subedar (R) Farooq Azam',
      email: 'security@hostelportal.pk',
      password: adminPassHash,
      role: 'SECURITY',
      phone: '+92 333 9988776',
      cnic: '38101-9988776-5',
      address: 'Security Control Post Gate 1',
      status: 'ACTIVE',
      created_at: new Date('2026-01-10').toISOString(),
    },
    {
      id: 'usr_student_ali',
      full_name: 'Ali Hamza',
      email: 'ali.hamza@student.pk',
      password: studentPassHash,
      role: 'STUDENT',
      phone: '+92 345 5544332',
      cnic: '35202-6789123-1',
      address: 'House 42, Street 7, Model Town, Lahore',
      status: 'ACTIVE',
      created_at: new Date('2026-02-01').toISOString(),
    },
    {
      id: 'usr_student_bilal',
      full_name: 'Bilal Hassan',
      email: 'bilal.hassan@student.pk',
      password: studentPassHash,
      role: 'STUDENT',
      phone: '+92 312 8877665',
      cnic: '37402-4455667-9',
      address: 'Satellite Town, Block B, Rawalpindi',
      status: 'ACTIVE',
      created_at: new Date('2026-02-15').toISOString(),
    },
  ];

  const room_types: RoomType[] = [
    {
      id: 'rt_1seater',
      name: '1-Seater Private Room',
      seater_count: 1,
      default_rent: 28000,
      default_deposit: 15000,
      description: 'Private single executive room with attached washroom, study table, and balcony.',
    },
    {
      id: 'rt_2seater',
      name: '2-Seater Premium Shared',
      seater_count: 2,
      default_rent: 19500,
      default_deposit: 12000,
      description: 'Spacious twin sharing room with separate wardrobes, attached bath, and quiet study zone.',
    },
    {
      id: 'rt_3seater',
      name: '3-Seater Comfort Room',
      seater_count: 3,
      default_rent: 15500,
      default_deposit: 10000,
      description: 'Economical three-bed room with individual study lamps, lockers, and high-speed Wi-Fi.',
    },
    {
      id: 'rt_4seater',
      name: '4-Seater Economy Quad',
      seater_count: 4,
      default_rent: 12500,
      default_deposit: 8000,
      description: 'Budget-friendly four-person room designed for active students with secure lockers.',
    },
  ];

  const rooms: Room[] = [
    {
      id: 'rm_101',
      room_number: '101',
      room_type_id: 'rt_1seater',
      seater_count: 1,
      floor: 1,
      capacity: 1,
      monthly_rent: 28000,
      security_deposit: 15000,
      available_beds: 1,
      facilities: ['Attached Bath', 'Balcony', 'AC/Heater Point', 'Study Desk', 'Cupboard', '24/7 UPS & Solar'],
      status: 'AVAILABLE',
      images: [
        '/src/assets/images/comfortable_room_1791029014471.jpg',
        '/src/assets/images/hostel_exterior_1791028997189.jpg',
      ],
      rules: ['No smoking inside room', 'Keep noise levels minimum after 10 PM', 'Do not alter electrical points'],
      description: 'Well-appointed private single room on the quiet 1st floor with ample natural light and personal workspace.',
    },
    {
      id: 'rm_102',
      room_number: '102',
      room_type_id: 'rt_2seater',
      seater_count: 2,
      floor: 1,
      capacity: 2,
      monthly_rent: 19500,
      security_deposit: 12000,
      available_beds: 1,
      facilities: ['Attached Bath', 'High Speed Wi-Fi', 'Individual Lockers', '24/7 Generator', 'Window View'],
      status: 'AVAILABLE',
      images: [
        '/src/assets/images/comfortable_room_1791029014471.jpg',
        '/src/assets/images/study_area_1791029043422.jpg',
      ],
      rules: ['Shared room cleanliness must be maintained', 'No unauthorized day guests after 8 PM'],
      description: 'Popular twin sharing room. Currently occupied by one quiet NUST engineering student, one bed available.',
    },
    {
      id: 'rm_103',
      room_number: '103',
      room_type_id: 'rt_2seater',
      seater_count: 2,
      floor: 1,
      capacity: 2,
      monthly_rent: 19500,
      security_deposit: 12000,
      available_beds: 0,
      facilities: ['Attached Bath', 'Wardrobe', 'Ceiling Fan', 'Study Table'],
      status: 'OCCUPIED',
      images: ['/src/assets/images/comfortable_room_1791029014471.jpg'],
      rules: ['Follow hostel timings strictly'],
      description: 'Fully occupied twin sharing room on 1st floor.',
    },
    {
      id: 'rm_201',
      room_number: '201',
      room_type_id: 'rt_3seater',
      seater_count: 3,
      floor: 2,
      capacity: 3,
      monthly_rent: 15500,
      security_deposit: 10000,
      available_beds: 2,
      facilities: ['Attached Bath', '3 Secure Lockers', 'Wi-Fi 6', 'Hot Water Geyser', 'Filtered Water Cooler'],
      status: 'AVAILABLE',
      images: [
        '/src/assets/images/comfortable_room_1791029014471.jpg',
        '/src/assets/images/quality_food_1791029029513.jpg',
      ],
      rules: ['Clean your study station daily', 'Room inspection every Sunday morning'],
      description: 'Bright 3-seater room overlooking the garden courtyard with excellent ventilation and quiet ambiance.',
    },
    {
      id: 'rm_202',
      room_number: '202',
      room_type_id: 'rt_4seater',
      seater_count: 4,
      floor: 2,
      capacity: 4,
      monthly_rent: 12500,
      security_deposit: 8000,
      available_beds: 3,
      facilities: ['Spacious Layout', '4 Lockers', '2 Study Desks', 'Attached Bath', 'High-Speed Wi-Fi'],
      status: 'AVAILABLE',
      images: ['/src/assets/images/comfortable_room_1791029014471.jpg'],
      rules: ['Maintain quiet hours during examination periods'],
      description: 'Economical 4-seater room suitable for student groups or budget-conscious medical/engineering scholars.',
    },
    {
      id: 'rm_301',
      room_number: '301',
      room_type_id: 'rt_1seater',
      seater_count: 1,
      floor: 3,
      capacity: 1,
      monthly_rent: 28000,
      security_deposit: 15000,
      available_beds: 0,
      facilities: ['Attached Bath', 'Rooftop View', 'Quiet Zone', 'Study Desk'],
      status: 'MAINTENANCE',
      images: ['/src/assets/images/comfortable_room_1791029014471.jpg'],
      rules: ['Maintenance in progress - painting & AC servicing'],
      description: 'Executive penthouse single room currently undergoing seasonal maintenance.',
    },
  ];

  const bookings: Booking[] = [
    {
      id: 'bk_demo_01',
      booking_id: 'HST-2026-1001',
      user_id: 'usr_student_ali',
      user_name: 'Ali Hamza',
      user_email: 'ali.hamza@student.pk',
      user_phone: '+92 345 5544332',
      user_cnic: '35202-6789123-1',
      room_id: 'rm_102',
      room_number: '102',
      seater_count: 2,
      check_in_date: '2026-02-01',
      stay_duration_months: 6,
      food_required: true,
      food_plan_id: 'fp_standard_full',
      status: 'CONFIRMED',
      total_initial_payment: 39500, // 19500 rent + 12000 deposit + 8000 food
      rent_amount: 19500,
      security_deposit: 12000,
      food_charges: 8000,
      other_charges: 0,
      guardian_name: 'Muhammad Hamza (Father)',
      institute_name: 'NUST Islamabad (SEECS)',
      registration_no: '2024-NUST-CS-089',
      emergency_name: 'Muhammad Hamza',
      emergency_relation: 'Father',
      emergency_phone: '+92 300 4433221',
      created_at: new Date('2026-01-20').toISOString(),
    },
    {
      id: 'bk_demo_02',
      booking_id: 'HST-2026-1002',
      user_id: 'usr_student_bilal',
      user_name: 'Bilal Hassan',
      user_email: 'bilal.hassan@student.pk',
      user_phone: '+92 312 8877665',
      user_cnic: '37402-4455667-9',
      room_id: 'rm_201',
      room_number: '201',
      seater_count: 3,
      check_in_date: '2026-03-01',
      stay_duration_months: 12,
      food_required: true,
      food_plan_id: 'fp_standard_full',
      status: 'PAYMENT PENDING',
      total_initial_payment: 33500, // 15500 rent + 10000 deposit + 8000 food
      rent_amount: 15500,
      security_deposit: 10000,
      food_charges: 8000,
      other_charges: 0,
      guardian_name: 'Hassan Mehmood (Father)',
      institute_name: 'FAST-NUCES Islamabad',
      registration_no: '23I-1142',
      emergency_name: 'Hassan Mehmood',
      emergency_relation: 'Father',
      emergency_phone: '+92 333 5566778',
      created_at: new Date('2026-02-18').toISOString(),
    },
  ];

  const payments: Payment[] = [
    {
      id: 'pay_demo_01',
      payment_id: 'PAY-2026-8801',
      booking_id: 'HST-2026-1001',
      user_id: 'usr_student_ali',
      user_name: 'Ali Hamza',
      amount: 39500,
      payment_method: 'JAZZCASH',
      transaction_id: 'JC-992817462',
      payment_date: '2026-01-21',
      status: 'VERIFIED',
      verified_by: 'Ahmed Raza Siddiqui (Manager)',
      verified_at: new Date('2026-01-22').toISOString(),
      created_at: new Date('2026-01-21').toISOString(),
    },
    {
      id: 'pay_demo_02',
      payment_id: 'PAY-2026-8802',
      booking_id: 'HST-2026-1002',
      user_id: 'usr_student_bilal',
      user_name: 'Bilal Hassan',
      amount: 33500,
      payment_method: 'EASYPAISA',
      transaction_id: 'EP-440192837',
      payment_date: '2026-02-19',
      status: 'VERIFICATION PENDING',
      created_at: new Date('2026-02-19').toISOString(),
    },
  ];

  const invoices: Invoice[] = [
    {
      id: 'inv_demo_01',
      invoice_number: 'INV-2026-0041',
      user_id: 'usr_student_ali',
      user_name: 'Ali Hamza',
      booking_id: 'HST-2026-1001',
      payment_id: 'PAY-2026-8801',
      issue_date: '2026-01-21',
      due_date: '2026-01-25',
      room_rent: 19500,
      security_deposit: 12000,
      food_charges: 8000,
      other_charges: 0,
      total_amount: 39500,
      status: 'PAID',
    },
    {
      id: 'inv_demo_02',
      invoice_number: 'INV-2026-0042',
      user_id: 'usr_student_bilal',
      user_name: 'Bilal Hassan',
      booking_id: 'HST-2026-1002',
      payment_id: 'PAY-2026-8802',
      issue_date: '2026-02-19',
      due_date: '2026-02-25',
      room_rent: 15500,
      security_deposit: 10000,
      food_charges: 8000,
      other_charges: 0,
      total_amount: 33500,
      status: 'UNPAID',
    },
  ];

  const residents: Resident[] = [
    {
      id: 'res_demo_01',
      user_id: 'usr_student_ali',
      full_name: 'Ali Hamza',
      email: 'ali.hamza@student.pk',
      phone: '+92 345 5544332',
      cnic: '35202-6789123-1',
      room_id: 'rm_102',
      room_number: '102',
      bed_number: 1,
      check_in_date: '2026-02-01',
      status: 'ACTIVE',
      emergency_contact: {
        name: 'Muhammad Hamza',
        relation: 'Father',
        phone: '+92 300 4433221',
      },
      notes: 'Clean student, enrolled in Semester 4 Software Engineering.',
    },
  ];

  const complaints: Complaint[] = [
    {
      id: 'cmp_demo_01',
      complaint_id: 'CMP-2026-0082',
      user_id: 'usr_student_ali',
      user_name: 'Ali Hamza',
      room_number: '102',
      phone: '+92 345 5544332',
      category: 'Wi-Fi',
      severity: 'NORMAL',
      description: 'The Wi-Fi access point near Room 102 suffers from periodic 5-minute disconnects around 9:00 PM.',
      incident_date: '2026-02-15 21:00',
      incident_location: '1st Floor Corridor Node B',
      status: 'In Progress',
      assigned_to: 'IT Support & Network Tech',
      internal_notes: ['Router rebooted, requested ISP fiber check for latency spike on upstream gateway.'],
      resident_updates: [
        {
          timestamp: '2026-02-16 10:30',
          note: 'Technician dispatched to replace the wireless access point antenna.',
          author: 'Hostel Manager',
        },
      ],
      is_confidential: false,
      created_at: new Date('2026-02-15T21:30:00Z').toISOString(),
      updated_at: new Date('2026-02-16T10:30:00Z').toISOString(),
    },
    {
      id: 'cmp_demo_02',
      complaint_id: 'CMP-2026-0083',
      user_id: 'usr_student_ali',
      user_name: 'Ali Hamza',
      room_number: '102',
      phone: '+92 345 5544332',
      category: 'Theft',
      severity: 'SERIOUS',
      description: 'Locker padlock attempted forced entry in shared hallway luggage room. Suspect seen on CCTV corridor at 3:15 AM.',
      incident_date: '2026-02-24 03:15',
      incident_location: 'Luggage Storage Section East',
      status: 'Escalated',
      assigned_to: 'Subedar (R) Farooq Azam (Security Head)',
      internal_notes: [
        'CCTV footage retrieved for camera #4 and #6.',
        'Formal police escalation initiated due to repeated attempted break-ins in the vicinity.',
      ],
      resident_updates: [
        {
          timestamp: '2026-02-24 09:00',
          note: 'Case escalated to hostel head of security and local police station liaison.',
          author: 'Ahmed Raza Siddiqui (Manager)',
        },
      ],
      is_confidential: true,
      police_escalation_id: 'pol_esc_001',
      created_at: new Date('2026-02-24T04:00:00Z').toISOString(),
      updated_at: new Date('2026-02-24T09:00:00Z').toISOString(),
    },
  ];

  const police_escalations: PoliceEscalation[] = [
    {
      id: 'pol_esc_001',
      complaint_id: 'CMP-2026-0083',
      complainant_name: 'Ali Hamza',
      room_number: '102',
      category: 'Theft',
      severity: 'SERIOUS',
      incident_date: '2026-02-24 03:15',
      incident_details: 'Attempted break-in and locker tampering in shared luggage storage section.',
      police_jurisdiction: 'Islamabad Capital Territory Police - Industrial Area / Sector I-9 Division',
      police_station: 'Sabzi Mandi / I-9 Police Station, Islamabad',
      official_contact: 'Police Station Duty Officer: +92 51 9258380 / Emergency: 15',
      official_complaint_portal: 'https://islamabadpolice.gov.pk/citizen-services',
      police_reference_number: 'ICT-FIR-2026/894-B',
      escalation_status: 'UNDER INVESTIGATION',
      submission_date: '2026-02-24 10:15',
      officer_name: 'ASI Naveed Akhtar (Investigating Officer)',
      notes: 'Investigating officer visited hostel premises, reviewed CCTV footage, and filed formal daily diary entry (Rapat #14).',
      status_history: [
        {
          timestamp: '2026-02-24 09:15',
          status: 'REQUESTED',
          note: 'Hostel Administration initiated official police escalation protocol.',
          updated_by: 'Hostel Admin',
        },
        {
          timestamp: '2026-02-24 10:15',
          status: 'SUBMITTED',
          note: 'Formal written report and USB containing CCTV evidence submitted at I-9 Police Station.',
          updated_by: 'Subedar (R) Farooq Azam',
        },
        {
          timestamp: '2026-02-24 14:00',
          status: 'UNDER INVESTIGATION',
          note: 'ASI Naveed Akhtar assigned. Police Reference Number ICT-FIR-2026/894-B issued.',
          updated_by: 'Subedar (R) Farooq Azam',
        },
      ],
      created_at: new Date('2026-02-24T09:15:00Z').toISOString(),
      updated_at: new Date('2026-02-24T14:00:00Z').toISOString(),
    },
  ];

  const facilities: Facility[] = [
    {
      id: 'fac_01',
      code: 'LOCATION',
      name: 'Location',
      description: 'Prime & Safe Area near major universities (NUST, FAST, COMSATS, IIUI, Bahria)',
      category: 'Core',
      is_enabled: true,
      icon_name: 'MapPin',
      highlight: 'Prime & Safe Area',
    },
    {
      id: 'fac_02',
      code: 'WIFI',
      name: 'Wi-Fi',
      description: 'High Speed Dual-Band Fiber Internet with dedicated redundant backup line',
      category: 'Technology',
      is_enabled: true,
      icon_name: 'Wifi',
      highlight: 'High Speed Internet',
    },
    {
      id: 'fac_03',
      code: 'ELECTRICITY',
      name: '24-Hour Electricity',
      description: 'Heavy duty Perkins generator + hybrid solar inverter backup (Zero load-shedding)',
      category: 'Core',
      is_enabled: true,
      icon_name: 'Zap',
      highlight: 'Reliable Power Supply',
    },
    {
      id: 'fac_04',
      code: 'CLEAN_ROOMS',
      name: 'Clean Rooms',
      description: 'Daily housekeeping, sanitization, clean bed sheets, and scheduled disinfection',
      category: 'Hygiene',
      is_enabled: true,
      icon_name: 'Bed',
      highlight: 'Hygienic & Comfortable',
    },
    {
      id: 'fac_05',
      code: 'CLEAN_WATER',
      name: 'Clean Water',
      description: 'Multi-stage RO filtered mineral-grade safe drinking water on all floors',
      category: 'Health',
      is_enabled: true,
      icon_name: 'Droplets',
      highlight: 'Safe Drinking Water',
    },
    {
      id: 'fac_06',
      code: 'WATER_COOLER',
      name: 'Water Cooler',
      description: 'Chilled dispensers in summer and geyser heated water systems in winter',
      category: 'Health',
      is_enabled: true,
      icon_name: 'Refrigerator',
      highlight: 'Fresh & Healthy',
    },
    {
      id: 'fac_07',
      code: 'IRON_FACILITY',
      name: 'Iron Facility',
      description: 'Designated laundry room with modern steam iron stands and washing machines',
      category: 'Convenience',
      is_enabled: true,
      icon_name: 'Shirt',
      highlight: 'For Your Convenience',
    },
    {
      id: 'fac_08',
      code: 'FOOD',
      name: 'Food',
      description: 'Nutritious & tasty hygienic 3-times meals prepared by expert mess chefs',
      category: 'Dining',
      is_enabled: true,
      icon_name: 'Utensils',
      highlight: 'Nutritious & Tasty',
    },
    {
      id: 'fac_09',
      code: 'SECURITY',
      name: 'Security',
      description: '24/7 armed security guards, biometrics gate access, and CCTV surveillance',
      category: 'Safety',
      is_enabled: true,
      icon_name: 'ShieldCheck',
      highlight: '24/7 Protection',
    },
    {
      id: 'fac_10',
      code: 'EMERGENCY',
      name: 'Emergency Contact',
      description: '24/7 on-duty warden, first aid kit, ambulance link (1122), and police protocol',
      category: 'Safety',
      is_enabled: true,
      icon_name: 'BellAlert',
      highlight: 'Always Available',
    },
  ];

  const food_plans: FoodPlan[] = [
    {
      id: 'fp_standard_full',
      name: 'Full Board Mess Plan (Breakfast + Lunch + Dinner)',
      timing: 'Breakfast: 7:00 AM - 9:30 AM | Lunch: 1:00 PM - 3:00 PM | Dinner: 7:30 PM - 10:00 PM',
      price_pkr: 8500,
      menu_summary: 'Fresh roti, seasonal chicken curry, daal, rice, tea, and weekly special biryani & halwa puri.',
      menu_schedule: {
        Monday: 'Breakfast: Paratha + Omelette + Chai | Lunch: Daal Mash + Salad | Dinner: Chicken Qorma + Roti',
        Tuesday: 'Breakfast: Anda Ghotala + Chai | Lunch: Aloo Palak + Rice | Dinner: Beef Haleem + Naan',
        Wednesday: 'Breakfast: Boiled Eggs + Butter Toast + Tea | Lunch: Chana Pulao + Raita | Dinner: Chicken Karahi + Roti',
        Thursday: 'Breakfast: Aloo Paratha + Dahi + Chai | Lunch: Mix Sabzi + Roti | Dinner: Daal Chawal + Shami Kabab',
        Friday: 'Breakfast: Omelette + Toast + Chai | Lunch: Special Chicken Biryani + Cold Drink | Dinner: Chicken Nihari + Naan',
        Saturday: 'Breakfast: Chana Paratha + Chai | Lunch: Sabzi Pulao + Salad | Dinner: Chicken Handi + Roti',
        Sunday: 'Breakfast: Special Halwa Puri + Chana + Chai | Lunch: Light Khichdi / Free Time | Dinner: Chicken Pulao + Kheer',
      },
      rules: [
        'Meal timings must be respected strictly.',
        'Food cannot be taken inside bedrooms without warden permission in case of illness.',
        'Outside food delivery is allowed until 11:00 PM.',
      ],
      is_active: true,
    },
    {
      id: 'fp_two_meals',
      name: 'Two Meals Plan (Breakfast + Dinner)',
      timing: 'Breakfast: 7:00 AM - 9:30 AM | Dinner: 7:30 PM - 10:00 PM',
      price_pkr: 6500,
      menu_summary: 'Ideal for university students who take lunch on campus.',
      menu_schedule: {
        Weekdays: 'Full Breakfast + Evening Hot Dinner with Chicken 4 days a week.',
        Weekends: 'Sunday special Halwa Puri brunch + Dinner feast.',
      },
      rules: ['Change of meal plan requires 5 days advance notice prior to month start.'],
      is_active: true,
    },
  ];

  const hostel_policies: HostelPolicy[] = [
    {
      id: 'pol_01',
      category: 'Check-in & Registration',
      title: 'Hostel Admission & Check-in Requirements',
      items: [
        'Original CNIC / B-Form and University/Work ID card must be presented at the time of check-in.',
        'Security deposit of one month is mandatory and refundable upon 30 days prior written check-out notice.',
        'Room allocation is strictly managed by administration; room swapping without prior approval is prohibited.',
      ],
    },
    {
      id: 'pol_02',
      category: 'Hostel Timings & Curfew',
      title: 'Gate Timings & Night Attendance',
      items: [
        'Main hostel gates close strictly at 10:00 PM (Summer) and 9:30 PM (Winter).',
        'Late entries require prior signed permission slip or SMS from verified guardian.',
        'Night biometric attendance is taken between 9:30 PM and 10:00 PM every evening.',
      ],
    },
    {
      id: 'pol_03',
      category: 'Visitors & Guests',
      title: 'Visitor & Parental Access Policy',
      items: [
        'Parents and legal guardians may meet residents in the Ground Floor Reception lounge until 8:00 PM.',
        'No external guests or male visitors are allowed inside private living quarters.',
        'Night stay for guest requires advance booking and nominal guest room fee.',
      ],
    },
    {
      id: 'pol_04',
      category: 'Electricity & Appliances',
      title: 'Electrical Safety & Load Management',
      items: [
        'Room lights, fans, and ACs must be switched off when leaving the room.',
        'High-load unapproved electrical appliances (heaters, heavy immersion rods) are strictly prohibited.',
        'UPS and generator supply guarantees lighting, fans, Wi-Fi, and laptop/phone charging 24/7.',
      ],
    },
    {
      id: 'pol_05',
      category: 'Cleanliness & Discipline',
      title: 'Discipline, Noise & Code of Conduct',
      items: [
        'Quiet study hours are observed from 11:00 PM to 6:00 AM daily.',
        'Smoking, alcohol, vapes, weapons, or contraband substances are strictly prohibited under zero-tolerance policy.',
        'Any act of bullying, harassment, theft, or verbal abuse will lead to immediate expulsion and police escalation.',
      ],
    },
    {
      id: 'pol_06',
      category: 'Payment, Cancellation & Refund',
      title: 'Fee Payment, Cancellation & Refund Policy',
      items: [
        'Monthly rent is due by the 5th of each calendar month. A late fee of Rs. 200/day applies after the 10th.',
        'Security deposit is 100% refundable subject to clearance of room inventory and clearance of outstanding dues.',
        'Booking cancellation 7 days before check-in allows 90% deposit refund.',
      ],
    },
  ];

  const gallery: GalleryItem[] = [
    {
      id: 'gal_01',
      title: 'Main Hostel Building & Exterior',
      category: 'Exterior',
      image_url: '/src/assets/images/hero_hostel_building_1791028979267.jpg',
      description: 'Modern illuminated facade with landscaped gardens and 24/7 security guard post.',
    },
    {
      id: 'gal_02',
      title: 'Front Courtyard & Architecture',
      category: 'Exterior',
      image_url: '/src/assets/images/hostel_exterior_1791028997189.jpg',
      description: 'Daylight view of the multi-story student accommodation complex.',
    },
    {
      id: 'gal_03',
      title: 'Premium Twin Sharing Bedroom',
      category: 'Rooms',
      image_url: '/src/assets/images/comfortable_room_1791029014471.jpg',
      description: 'Hygienic, comfortable room setup with orthopedic mattresses and study lamps.',
    },
    {
      id: 'gal_04',
      title: 'Dining Hall & Mess Cafeteria',
      category: 'Food',
      image_url: '/src/assets/images/quality_food_1791029029513.jpg',
      description: 'Hygienic mess facility with stainless steel serving counters and ample seating.',
    },
    {
      id: 'gal_05',
      title: 'Academic Library & Quiet Study Hall',
      category: 'Study Area',
      image_url: '/src/assets/images/study_area_1791029043422.jpg',
      description: 'Air-conditioned study lounge stocked with textbooks and ergonomic seating.',
    },
  ];

  const emergency_contacts: EmergencyContact[] = [
    {
      id: 'emg_01',
      title: 'Police Emergency Helpline (15)',
      service_type: 'Police / Law Enforcement',
      phone_number: '15',
      alternate_phone: '+92 51 9258380',
      address: 'I-9 Police Station, Sector I-9 Markaz, Islamabad',
      is_primary: true,
      description: 'Instant police emergency dispatch. Integrated directly with Safe City Islamabad surveillance.',
    },
    {
      id: 'emg_02',
      title: 'Rescue 1122 Ambulance & Fire',
      service_type: 'Medical & Fire Rescue',
      phone_number: '1122',
      alternate_phone: '+92 51 9258500',
      address: 'Rescue 1122 Headquarters, Islamabad',
      is_primary: true,
      description: 'Paramedic emergency response, trauma ambulance, and fire rescue services.',
    },
    {
      id: 'emg_03',
      title: 'Hostel Emergency Warden / Manager On-Duty',
      service_type: 'Internal Hostel Emergency',
      phone_number: '+92 300 1234567',
      alternate_phone: '+92 321 7654321',
      address: 'Hostel Administration Office, Room G-01 Ground Floor',
      is_primary: true,
      description: 'Available 24/7 physically on site for medical emergencies, room issues, or immediate assistance.',
    },
    {
      id: 'emg_04',
      title: 'Women Helpline / Harassment Cell',
      service_type: 'Govt Protection Cell',
      phone_number: '1099',
      alternate_phone: '8787',
      address: 'Ministry of Human Rights Helpline / Punjab Police 8787',
      is_primary: false,
      description: 'Confidential reporting for harassment, threats, or abuse.',
    },
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif_01',
      user_id: 'ALL',
      title: 'Maintenance Schedule Notification',
      message: 'Water tank deep-cleaning is scheduled this Saturday between 11:00 AM and 2:00 PM. Please conserve water.',
      type: 'info',
      is_read: false,
      created_at: new Date('2026-02-20T10:00:00Z').toISOString(),
    },
    {
      id: 'notif_02',
      user_id: 'usr_student_ali',
      title: 'Payment Receipt Verified',
      message: 'Your payment of Rs. 39,500 for Booking HST-2026-1001 has been verified by Administration. Welcome!',
      type: 'success',
      is_read: false,
      link: '/payments',
      created_at: new Date('2026-01-22T12:00:00Z').toISOString(),
    },
  ];

  const contact_messages: ContactMessage[] = [
    {
      id: 'msg_01',
      name: 'Usman Ghani',
      email: 'usman.ghani@gmail.com',
      phone: '+92 302 9988112',
      subject: 'Inquiry for 2-Seater Room for Fast University Student',
      message: 'Salam, I am starting my BS CS at FAST Islamabad this coming semester. Are twin-sharing rooms available with food plan?',
      status: 'READ',
      created_at: new Date('2026-02-18T14:20:00Z').toISOString(),
    },
  ];

  const audit_logs: AuditLog[] = [
    {
      id: 'aud_01',
      user_id: 'usr_super_admin',
      user_name: 'Muhammad Tariq Khan',
      role: 'SUPER_ADMIN',
      action: 'SYSTEM_INITIALIZATION',
      details: 'Hostel Portal database initialized with approved visual system and security configurations.',
      timestamp: new Date('2026-01-01T08:00:00Z').toISOString(),
    },
    {
      id: 'aud_02',
      user_id: 'usr_hostel_manager',
      user_name: 'Ahmed Raza Siddiqui',
      role: 'HOSTEL_ADMIN',
      action: 'PAYMENT_VERIFIED',
      details: 'Verified JazzCash payment Rs. 39,500 for Resident Ali Hamza (Booking HST-2026-1001).',
      timestamp: new Date('2026-01-22T12:00:00Z').toISOString(),
    },
    {
      id: 'aud_03',
      user_id: 'usr_hostel_manager',
      user_name: 'Ahmed Raza Siddiqui',
      role: 'HOSTEL_ADMIN',
      action: 'POLICE_ESCALATION_SUBMITTED',
      details: 'Submitted formal theft investigation report ICT-FIR-2026/894-B to I-9 Police Station.',
      timestamp: new Date('2026-02-24T10:15:00Z').toISOString(),
    },
  ];

  const settings: HostelSettings = {
    hostel_name: 'AL-MADINA EXECUTIVE HOSTEL',
    tagline: 'STAY • STUDY • GROW',
    slogan: 'Comfortable, Clean & Affordable Hostel Living',
    complete_address: 'Plot 48, Street 14, Service Road South, Sector H-12 / I-9',
    city: 'Islamabad',
    district: 'Islamabad Capital Territory',
    province: 'Federal Capital',
    country: 'Pakistan',
    phone: '+92 300 1234567',
    whatsapp: '+92 300 1234567',
    email: 'info@hostelportal.pk',
    curfew_time: '10:00 PM',
    jazzcash_title: 'Al-Madina Hostel Operations',
    jazzcash_number: '0300-1234567',
    easypaisa_title: 'Al-Madina Hostel Management',
    easypaisa_number: '0321-7654321',
    bank_name: 'Meezan Bank Limited, Islamic Banking',
    bank_account_title: 'Al-Madina Hostel Services',
    bank_iban: 'PK45MEZN0001020304050607',
    police_station_name: 'Sabzi Mandi / I-9 Police Station',
    police_jurisdiction: 'Islamabad Capital Territory Police, Industrial Area Division',
    police_helpline: '15',
    police_station_phone: '+92 51 9258380',
    police_complaint_portal: 'https://islamabadpolice.gov.pk/citizen-services',
    emergency_helpline_1122: '1122',
    hostel_emergency_contact: '+92 300 1234567',
    map_embed_query: 'Islamabad+Sector+H-12+Pakistan',
    latitude: 33.6425,
    longitude: 73.0189,
  };

  return {
    users,
    room_types,
    rooms,
    bookings,
    payments,
    invoices,
    residents,
    complaints,
    police_escalations,
    facilities,
    food_plans,
    hostel_policies,
    gallery,
    emergency_contacts,
    notifications,
    contact_messages,
    audit_logs,
    settings,
  };
}

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return parsed;
      }
    } catch (err) {
      console.error('Error loading db file, re-seeding:', err);
    }

    const initial = getInitialSeedData();
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public getRawData(): DatabaseSchema {
    return this.data;
  }

  public save() {
    this.saveData(this.data);
  }

  // --- Audit Logging ---
  public logAudit(userId: string, userName: string, role: string, action: string, details: string) {
    const entry: AuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      user_id: userId,
      user_name: userName,
      role,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    this.data.audit_logs.unshift(entry);
    this.save();
  }

  // --- Users & Auth ---
  public getUsers() {
    return this.data.users.map(({ password, ...u }) => u);
  }

  public findUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(user: Omit<User, 'id' | 'created_at'>): User {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newUser: User = {
      ...user,
      id,
      password: user.password ? hashPassword(user.password) : undefined,
      created_at: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    if (updates.password) {
      updates.password = hashPassword(updates.password);
    }
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  // --- Rooms & Double Booking Prevention ---
  public getRooms() {
    return this.data.rooms;
  }

  public getRoomById(id: string) {
    return this.data.rooms.find((r) => r.id === id);
  }

  public addRoom(roomData: Omit<Room, 'id'>, user: { id: string; name: string; role: string }) {
    const id = `rm_${roomData.room_number}_${Date.now()}`;
    const newRoom: Room = { ...roomData, id };
    this.data.rooms.push(newRoom);
    this.logAudit(user.id, user.name, user.role, 'ADD_ROOM', `Added room #${roomData.room_number} (${roomData.seater_count}-Seater).`);
    this.save();
    return newRoom;
  }

  public updateRoom(id: string, updates: Partial<Room>, user: { id: string; name: string; role: string }) {
    const idx = this.data.rooms.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.data.rooms[idx] = { ...this.data.rooms[idx], ...updates };
    this.logAudit(user.id, user.name, user.role, 'UPDATE_ROOM', `Updated room #${this.data.rooms[idx].room_number}.`);
    this.save();
    return this.data.rooms[idx];
  }

  public deleteRoom(id: string, user: { id: string; name: string; role: string }) {
    const room = this.getRoomById(id);
    if (!room) return false;
    // Check if room has active bookings
    const activeBookings = this.data.bookings.filter(
      (b) => b.room_id === id && ['CONFIRMED', 'CHECKED-IN'].includes(b.status)
    );
    if (activeBookings.length > 0) {
      throw new Error('Cannot delete room with active resident bookings.');
    }
    this.data.rooms = this.data.rooms.filter((r) => r.id !== id);
    this.logAudit(user.id, user.name, user.role, 'DELETE_ROOM', `Deleted room #${room.room_number}.`);
    this.save();
    return true;
  }

  // --- Bookings & Double Booking Prevention Logic ---
  public getBookings() {
    return this.data.bookings;
  }

  public getBookingById(id: string) {
    return this.data.bookings.find((b) => b.id === id || b.booking_id === id);
  }

  public createBooking(bookingData: Omit<Booking, 'id' | 'booking_id' | 'created_at'>) {
    const room = this.getRoomById(bookingData.room_id);
    if (!room) {
      throw new Error('Selected room does not exist.');
    }

    if (room.status === 'MAINTENANCE' || room.status === 'UNAVAILABLE') {
      throw new Error(`Room ${room.room_number} is currently under ${room.status.toLowerCase()} and cannot be booked.`);
    }

    // Double Booking Prevention
    if (room.available_beds <= 0 || room.status === 'OCCUPIED') {
      throw new Error(`Room ${room.room_number} has no available beds.`);
    }

    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    const booking_id = `HST-2026-${uniqueNum}`;
    const id = `bk_${Date.now()}_${uniqueNum}`;

    const newBooking: Booking = {
      ...bookingData,
      id,
      booking_id,
      status: 'PAYMENT PENDING',
      created_at: new Date().toISOString(),
    };

    this.data.bookings.unshift(newBooking);

    // Create initial invoice
    const invNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoice_number: invNum,
      user_id: bookingData.user_id,
      user_name: bookingData.user_name,
      booking_id: newBooking.booking_id,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
      room_rent: bookingData.rent_amount,
      security_deposit: bookingData.security_deposit,
      food_charges: bookingData.food_charges,
      other_charges: bookingData.other_charges,
      total_amount: bookingData.total_initial_payment,
      status: 'UNPAID',
    };
    this.data.invoices.unshift(newInvoice);

    // Notify Admins
    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      user_id: 'ADMIN',
      title: 'New Room Booking Request',
      message: `${bookingData.user_name} booked Room #${room.room_number}. Payment Pending.`,
      type: 'info',
      is_read: false,
      link: '/admin/bookings',
      created_at: new Date().toISOString(),
    });

    this.save();
    return newBooking;
  }

  public updateBookingStatus(
    id: string,
    status: Booking['status'],
    user: { id: string; name: string; role: string }
  ) {
    const booking = this.getBookingById(id);
    if (!booking) return null;

    const oldStatus = booking.status;
    booking.status = status;

    const room = this.getRoomById(booking.room_id);

    // If confirmed and wasn't confirmed before, decrement bed count
    if (status === 'CONFIRMED' && oldStatus !== 'CONFIRMED' && oldStatus !== 'CHECKED-IN') {
      if (room && room.available_beds > 0) {
        room.available_beds = Math.max(0, room.available_beds - 1);
        if (room.available_beds === 0) {
          room.status = 'OCCUPIED';
        }
      }
      // Add or update resident
      const existingResident = this.data.residents.find((r) => r.user_id === booking.user_id);
      if (!existingResident) {
        this.data.residents.push({
          id: `res_${Date.now()}`,
          user_id: booking.user_id,
          full_name: booking.user_name,
          email: booking.user_email,
          phone: booking.user_phone,
          cnic: booking.user_cnic,
          room_id: booking.room_id,
          room_number: booking.room_number,
          bed_number: (room?.capacity || 1) - (room?.available_beds || 0),
          check_in_date: booking.check_in_date,
          status: 'ACTIVE',
          emergency_contact: {
            name: booking.emergency_name,
            relation: booking.emergency_relation,
            phone: booking.emergency_phone,
          },
          notes: `Booking ${booking.booking_id} verified.`,
        });
      }
    } else if (
      (status === 'CANCELLED' || status === 'REJECTED' || status === 'CHECKED-OUT') &&
      (oldStatus === 'CONFIRMED' || oldStatus === 'CHECKED-IN')
    ) {
      if (room) {
        room.available_beds = Math.min(room.capacity, room.available_beds + 1);
        if (room.available_beds > 0 && room.status === 'OCCUPIED') {
          room.status = 'AVAILABLE';
        }
      }
      const res = this.data.residents.find((r) => r.user_id === booking.user_id);
      if (res) {
        res.status = 'CHECKED_OUT';
        res.check_out_date = new Date().toISOString().split('T')[0];
      }
    }

    // Add notification for the user
    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      user_id: booking.user_id,
      title: `Booking ${status}`,
      message: `Your booking (${booking.booking_id}) status was updated to ${status}.`,
      type: status === 'CONFIRMED' ? 'success' : status === 'REJECTED' ? 'warning' : 'info',
      is_read: false,
      link: '/my-booking',
      created_at: new Date().toISOString(),
    });

    this.logAudit(
      user.id,
      user.name,
      user.role,
      'UPDATE_BOOKING_STATUS',
      `Booking ${booking.booking_id} changed from ${oldStatus} to ${status}.`
    );

    this.save();
    return booking;
  }

  // --- Payments & Verification ---
  public getPayments() {
    return this.data.payments;
  }

  public submitPayment(paymentData: Omit<Payment, 'id' | 'payment_id' | 'created_at' | 'status'>) {
    const unique = Math.floor(1000 + Math.random() * 9000);
    const payment_id = `PAY-2026-${unique}`;
    const id = `pay_${Date.now()}_${unique}`;

    const newPayment: Payment = {
      ...paymentData,
      id,
      payment_id,
      status: 'VERIFICATION PENDING',
      created_at: new Date().toISOString(),
    };

    this.data.payments.unshift(newPayment);

    // Update booking to VERIFICATION
    const booking = this.data.bookings.find((b) => b.booking_id === paymentData.booking_id || b.id === paymentData.booking_id);
    if (booking) {
      booking.status = 'VERIFICATION';
    }

    // Notify Admin
    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      user_id: 'ADMIN',
      title: 'Payment Verification Required',
      message: `Resident ${paymentData.user_name} submitted ${paymentData.payment_method} payment of PKR ${paymentData.amount.toLocaleString()} (TxID: ${paymentData.transaction_id}). Verification pending.`,
      type: 'warning',
      is_read: false,
      link: '/admin/payments',
      created_at: new Date().toISOString(),
    });

    this.save();
    return newPayment;
  }

  public verifyPayment(id: string, user: { id: string; name: string; role: string }) {
    const payment = this.data.payments.find((p) => p.id === id || p.payment_id === id);
    if (!payment) return null;

    payment.status = 'VERIFIED';
    payment.verified_by = `${user.name} (${user.role})`;
    payment.verified_at = new Date().toISOString();

    // Update invoice if matched
    const invoice = this.data.invoices.find((inv) => inv.booking_id === payment.booking_id);
    if (invoice) {
      invoice.status = 'PAID';
      invoice.payment_id = payment.payment_id;
    }

    // Update booking to CONFIRMED
    const booking = this.data.bookings.find((b) => b.booking_id === payment.booking_id);
    if (booking && booking.status !== 'CONFIRMED' && booking.status !== 'CHECKED-IN') {
      this.updateBookingStatus(booking.id, 'CONFIRMED', user);
    }

    // Notify Resident
    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      user_id: payment.user_id,
      title: 'Payment Verified!',
      message: `Your payment of PKR ${payment.amount.toLocaleString()} has been verified by Administration. Booking confirmed!`,
      type: 'success',
      is_read: false,
      link: '/payments',
      created_at: new Date().toISOString(),
    });

    this.logAudit(user.id, user.name, user.role, 'VERIFY_PAYMENT', `Verified payment ${payment.payment_id} of PKR ${payment.amount}.`);
    this.save();
    return payment;
  }

  public rejectPayment(id: string, reason: string, user: { id: string; name: string; role: string }) {
    const payment = this.data.payments.find((p) => p.id === id || p.payment_id === id);
    if (!payment) return null;

    payment.status = 'FAILED';
    payment.rejection_reason = reason;
    payment.verified_by = `${user.name} (${user.role})`;
    payment.verified_at = new Date().toISOString();

    const booking = this.data.bookings.find((b) => b.booking_id === payment.booking_id);
    if (booking) {
      booking.status = 'PAYMENT PENDING';
    }

    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      user_id: payment.user_id,
      title: 'Payment Verification Failed',
      message: `Your payment of PKR ${payment.amount.toLocaleString()} was not verified. Reason: ${reason}. Please re-submit valid receipt.`,
      type: 'warning',
      is_read: false,
      link: '/payments',
      created_at: new Date().toISOString(),
    });

    this.logAudit(user.id, user.name, user.role, 'REJECT_PAYMENT', `Rejected payment ${payment.payment_id}. Reason: ${reason}`);
    this.save();
    return payment;
  }

  // --- Complaints & Police Escalations ---
  public getComplaints() {
    return this.data.complaints;
  }

  public createComplaint(complaintData: Omit<Complaint, 'id' | 'complaint_id' | 'created_at' | 'updated_at' | 'status' | 'internal_notes' | 'resident_updates'>) {
    const unique = Math.floor(1000 + Math.random() * 9000);
    const complaint_id = `CMP-2026-${unique}`;
    const id = `cmp_${Date.now()}_${unique}`;

    const newComplaint: Complaint = {
      ...complaintData,
      id,
      complaint_id,
      status: 'Submitted',
      internal_notes: [],
      resident_updates: [
        {
          timestamp: new Date().toISOString(),
          note: 'Complaint submitted successfully and queued for management review.',
          author: 'System',
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.data.complaints.unshift(newComplaint);

    // If emergency severity, auto alert admin and security
    if (complaintData.severity === 'EMERGENCY' || complaintData.severity === 'SERIOUS') {
      this.data.notifications.unshift({
        id: `notif_${Date.now()}`,
        user_id: 'ADMIN',
        title: `URGENT: ${complaintData.severity} Complaint Received`,
        message: `${complaintData.category} reported in Room #${complaintData.room_number} by ${complaintData.user_name}. Immediate response needed!`,
        type: 'emergency',
        is_read: false,
        link: '/admin/complaints',
        created_at: new Date().toISOString(),
      });
    }

    this.save();
    return newComplaint;
  }

  public updateComplaintStatus(
    id: string,
    updates: {
      status?: Complaint['status'];
      assigned_to?: string;
      internal_note?: string;
      resident_update?: string;
    },
    user: { id: string; name: string; role: string }
  ) {
    const complaint = this.data.complaints.find((c) => c.id === id || c.complaint_id === id);
    if (!complaint) return null;

    if (updates.status) complaint.status = updates.status;
    if (updates.assigned_to) complaint.assigned_to = updates.assigned_to;
    if (updates.internal_note) complaint.internal_notes.push(updates.internal_note);
    if (updates.resident_update) {
      complaint.resident_updates.push({
        timestamp: new Date().toISOString(),
        note: updates.resident_update,
        author: `${user.name} (${user.role})`,
      });
      // Notify resident
      this.data.notifications.unshift({
        id: `notif_${Date.now()}`,
        user_id: complaint.user_id,
        title: `Complaint Update: ${complaint.complaint_id}`,
        message: `Status: ${complaint.status}. Update: ${updates.resident_update}`,
        type: 'info',
        is_read: false,
        link: '/complaints',
        created_at: new Date().toISOString(),
      });
    }

    complaint.updated_at = new Date().toISOString();
    this.logAudit(user.id, user.name, user.role, 'UPDATE_COMPLAINT', `Updated complaint ${complaint.complaint_id} status to ${complaint.status}.`);
    this.save();
    return complaint;
  }

  // --- Police Escalation ---
  public getPoliceEscalations() {
    return this.data.police_escalations;
  }

  public createPoliceEscalation(
    complaintId: string,
    jurisdictionData: {
      police_jurisdiction?: string;
      police_station?: string;
      official_contact?: string;
      official_complaint_portal?: string;
      notes?: string;
    },
    user: { id: string; name: string; role: string }
  ) {
    const complaint = this.data.complaints.find((c) => c.id === complaintId || c.complaint_id === complaintId);
    if (!complaint) throw new Error('Complaint not found.');

    const settings = this.data.settings;
    const id = `pol_esc_${Date.now()}`;

    const escalation: PoliceEscalation = {
      id,
      complaint_id: complaint.complaint_id,
      complainant_name: complaint.user_name,
      room_number: complaint.room_number,
      category: complaint.category,
      severity: complaint.severity,
      incident_date: complaint.incident_date,
      incident_details: complaint.description,
      police_jurisdiction: jurisdictionData.police_jurisdiction || settings.police_jurisdiction,
      police_station: jurisdictionData.police_station || settings.police_station_name,
      official_contact: jurisdictionData.official_contact || settings.police_station_phone,
      official_complaint_portal: jurisdictionData.official_complaint_portal || settings.police_complaint_portal,
      escalation_status: 'REQUESTED',
      notes: jurisdictionData.notes,
      status_history: [
        {
          timestamp: new Date().toISOString(),
          status: 'REQUESTED',
          note: `Formal police escalation requested by ${user.name} (${user.role}).`,
          updated_by: user.name,
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.data.police_escalations.unshift(escalation);
    complaint.police_escalation_id = id;
    complaint.status = 'Escalated';
    complaint.resident_updates.push({
      timestamp: new Date().toISOString(),
      note: `Escalated to law enforcement (${escalation.police_station}). Jurisdiction: ${escalation.police_jurisdiction}`,
      author: `${user.name} (${user.role})`,
    });

    this.logAudit(user.id, user.name, user.role, 'CREATE_POLICE_ESCALATION', `Initiated police escalation for Complaint ${complaint.complaint_id}.`);
    this.save();
    return escalation;
  }

  public updatePoliceEscalation(
    id: string,
    updates: {
      status?: PoliceEscalation['escalation_status'];
      police_reference_number?: string;
      officer_name?: string;
      notes?: string;
      status_note?: string;
    },
    user: { id: string; name: string; role: string }
  ) {
    const esc = this.data.police_escalations.find((e) => e.id === id);
    if (!esc) return null;

    if (updates.status) esc.escalation_status = updates.status;
    if (updates.police_reference_number !== undefined) esc.police_reference_number = updates.police_reference_number;
    if (updates.officer_name !== undefined) esc.officer_name = updates.officer_name;
    if (updates.notes !== undefined) esc.notes = updates.notes;

    if (updates.status || updates.status_note) {
      esc.status_history.push({
        timestamp: new Date().toISOString(),
        status: esc.escalation_status,
        note: updates.status_note || `Status updated to ${esc.escalation_status}. Ref#: ${esc.police_reference_number || 'N/A'}`,
        updated_by: user.name,
      });
    }

    esc.updated_at = new Date().toISOString();
    this.logAudit(user.id, user.name, user.role, 'UPDATE_POLICE_ESCALATION', `Police escalation ${esc.id} updated to ${esc.escalation_status}. Ref: ${esc.police_reference_number || 'None'}`);
    this.save();
    return esc;
  }

  // --- Facilities Management ---
  public getFacilities() {
    return this.data.facilities;
  }

  public toggleFacility(id: string, is_enabled: boolean, user: { id: string; name: string; role: string }) {
    const fac = this.data.facilities.find((f) => f.id === id || f.code === id);
    if (!fac) return null;
    fac.is_enabled = is_enabled;
    this.logAudit(user.id, user.name, user.role, 'TOGGLE_FACILITY', `${is_enabled ? 'Enabled' : 'Disabled'} facility: ${fac.name}.`);
    this.save();
    return fac;
  }

  public updateFacility(id: string, updates: Partial<Facility>, user: { id: string; name: string; role: string }) {
    const idx = this.data.facilities.findIndex((f) => f.id === id || f.code === id);
    if (idx === -1) return null;
    this.data.facilities[idx] = { ...this.data.facilities[idx], ...updates };
    this.logAudit(user.id, user.name, user.role, 'UPDATE_FACILITY', `Updated facility ${this.data.facilities[idx].name}.`);
    this.save();
    return this.data.facilities[idx];
  }

  // --- Food Plans ---
  public getFoodPlans() {
    return this.data.food_plans;
  }

  public updateFoodPlan(id: string, updates: Partial<FoodPlan>, user: { id: string; name: string; role: string }) {
    const idx = this.data.food_plans.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    this.data.food_plans[idx] = { ...this.data.food_plans[idx], ...updates };
    this.logAudit(user.id, user.name, user.role, 'UPDATE_FOOD_PLAN', `Updated food plan ${this.data.food_plans[idx].name}.`);
    this.save();
    return this.data.food_plans[idx];
  }

  // --- Policies ---
  public getPolicies() {
    return this.data.hostel_policies;
  }

  public updatePolicy(id: string, updates: Partial<HostelPolicy>, user: { id: string; name: string; role: string }) {
    const idx = this.data.hostel_policies.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.hostel_policies[idx] = { ...this.data.hostel_policies[idx], ...updates };
    this.logAudit(user.id, user.name, user.role, 'UPDATE_POLICY', `Updated policy: ${this.data.hostel_policies[idx].title}.`);
    this.save();
    return this.data.hostel_policies[idx];
  }

  // --- Gallery ---
  public getGallery() {
    return this.data.gallery;
  }

  public addGalleryItem(item: Omit<GalleryItem, 'id'>, user: { id: string; name: string; role: string }) {
    const newItem: GalleryItem = { ...item, id: `gal_${Date.now()}` };
    this.data.gallery.push(newItem);
    this.logAudit(user.id, user.name, user.role, 'ADD_GALLERY_ITEM', `Added gallery image: ${item.title}.`);
    this.save();
    return newItem;
  }

  public deleteGalleryItem(id: string, user: { id: string; name: string; role: string }) {
    this.data.gallery = this.data.gallery.filter((g) => g.id !== id);
    this.logAudit(user.id, user.name, user.role, 'DELETE_GALLERY_ITEM', `Deleted gallery item ${id}.`);
    this.save();
    return true;
  }

  // --- Settings ---
  public getSettings() {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<HostelSettings>, user: { id: string; name: string; role: string }) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.logAudit(user.id, user.name, user.role, 'UPDATE_SETTINGS', 'Updated hostel general and emergency configuration settings.');
    this.save();
    return this.data.settings;
  }

  // --- Notifications ---
  public getNotifications(userId?: string) {
    if (!userId) return this.data.notifications;
    return this.data.notifications.filter(
      (n) => n.user_id === 'ALL' || n.user_id === userId || (userId.startsWith('adm') && n.user_id === 'ADMIN')
    );
  }

  public markNotificationRead(id: string) {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.is_read = true;
      this.save();
    }
    return notif;
  }

  // --- Contact Messages ---
  public getContactMessages() {
    return this.data.contact_messages;
  }

  public addContactMessage(data: Omit<ContactMessage, 'id' | 'status' | 'created_at'>) {
    const msg: ContactMessage = {
      ...data,
      id: `msg_${Date.now()}`,
      status: 'NEW',
      created_at: new Date().toISOString(),
    };
    this.data.contact_messages.unshift(msg);
    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      user_id: 'ADMIN',
      title: 'New Contact Inquiry',
      message: `Message from ${data.name}: ${data.subject}`,
      type: 'info',
      is_read: false,
      link: '/admin/messages',
      created_at: new Date().toISOString(),
    });
    this.save();
    return msg;
  }

  // --- Emergency Contacts ---
  public getEmergencyContacts() {
    return this.data.emergency_contacts;
  }
}

export const db = new DatabaseManager();
