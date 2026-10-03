import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { api } from './services/api.ts';
import {
  Room,
  Facility,
  FoodPlan,
  HostelPolicy,
  GalleryItem,
  EmergencyContact,
  HostelSettings,
  Booking,
  Payment,
  Complaint,
  PoliceEscalation,
  NotificationItem,
  Invoice,
} from './types.ts';

import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { RoomDetailsModal } from './components/RoomDetailsModal.tsx';

import { Home } from './pages/Home.tsx';
import { AboutHostel } from './pages/AboutHostel.tsx';
import { Rooms } from './pages/Rooms.tsx';
import { Facilities } from './pages/Facilities.tsx';
import { Food } from './pages/Food.tsx';
import { Gallery } from './pages/Gallery.tsx';
import { HostelPolicies } from './pages/HostelPolicies.tsx';
import { BookRoom } from './pages/BookRoom.tsx';
import { Complaints } from './pages/Complaints.tsx';
import { Emergency } from './pages/Emergency.tsx';
import { PoliceEscalation as PoliceEscalationPage } from './pages/PoliceEscalation.tsx';
import { ContactUs } from './pages/ContactUs.tsx';
import { AuthPages } from './pages/AuthPages.tsx';
import { ResidentDashboard } from './pages/ResidentDashboard.tsx';
import { AdminPanel } from './pages/AdminPanel.tsx';

function MainApp() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedRoomForModal, setSelectedRoomForModal] = useState<Room | null>(null);
  const [preSelectedRoomForBooking, setPreSelectedRoomForBooking] = useState<Room | null>(null);

  // Core Data States
  const [rooms, setRooms] = useState<Room[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [foodPlans, setFoodPlans] = useState<FoodPlan[]>([]);
  const [policies, setPolicies] = useState<HostelPolicy[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [settings, setSettings] = useState<HostelSettings | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [policeEscalations, setPoliceEscalations] = useState<PoliceEscalation[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // Load all data from API
  const refreshAllData = async () => {
    try {
      const [
        roomsRes,
        facRes,
        foodRes,
        polRes,
        galRes,
        emgRes,
        bookRes,
        payRes,
        invRes,
        cmpRes,
        policeRes,
        notifRes,
      ] = await Promise.all([
        api.getRooms(),
        api.getFacilities(true),
        api.getFoodPlans(),
        api.getPolicies(),
        api.getGallery(),
        api.getEmergency(),
        api.getBookings(),
        api.getPayments(),
        api.getInvoices(),
        api.getComplaints(),
        api.getPoliceEscalations(),
        api.getNotifications(),
      ]);

      setRooms(roomsRes.rooms || []);
      setFacilities(facRes.facilities || []);
      setFoodPlans(foodRes.foodPlans || []);
      setPolicies(polRes.policies || []);
      setGallery(galRes.gallery || []);
      setEmergencyContacts(emgRes.contacts || []);
      setSettings(emgRes.settings || null);
      setBookings(bookRes.bookings || []);
      setPayments(payRes.payments || []);
      setInvoices(invRes.invoices || []);
      setComplaints(cmpRes.complaints || []);
      setPoliceEscalations(policeRes.escalations || []);
      setNotifications(notifRes.notifications || []);
    } catch (err) {
      console.error('Error fetching portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [user]);

  const handleNavigate = (tab: string, param?: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookRoom = (room: Room) => {
    setPreSelectedRoomForBooking(room);
    setCurrentTab('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Global Header */}
      <Header currentTab={currentTab} onNavigate={handleNavigate} settings={settings} />

      {/* Main Pages Switcher */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <Home
            facilities={facilities}
            rooms={rooms}
            settings={settings}
            onNavigate={handleNavigate}
            onSelectRoom={setSelectedRoomForModal}
            onBookRoom={handleBookRoom}
          />
        )}

        {currentTab === 'about' && (
          <AboutHostel settings={settings} onNavigate={handleNavigate} />
        )}

        {currentTab === 'rooms' && (
          <Rooms
            rooms={rooms}
            onSelectRoom={setSelectedRoomForModal}
            onBookRoom={handleBookRoom}
          />
        )}

        {currentTab === 'facilities' && (
          <Facilities facilities={facilities} onNavigate={handleNavigate} />
        )}

        {currentTab === 'food' && (
          <Food foodPlans={foodPlans} onNavigate={handleNavigate} />
        )}

        {currentTab === 'gallery' && <Gallery gallery={gallery} />}

        {currentTab === 'policies' && <HostelPolicies policies={policies} />}

        {currentTab === 'book' && (
          <BookRoom
            rooms={rooms}
            foodPlans={foodPlans}
            settings={settings}
            preSelectedRoom={preSelectedRoomForBooking}
            onBookingComplete={() => {
              refreshAllData();
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'complaints' && (
          <Complaints
            complaints={complaints}
            onRefreshComplaints={refreshAllData}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'emergency' && (
          <Emergency
            contacts={emergencyContacts}
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'police-escalation' && (
          <PoliceEscalationPage
            escalations={policeEscalations}
            complaints={complaints}
            settings={settings}
            onRefresh={refreshAllData}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'contact' && <ContactUs settings={settings} />}

        {currentTab === 'login' && (
          <AuthPages mode="login" onNavigate={handleNavigate} />
        )}

        {currentTab === 'register' && (
          <AuthPages mode="register" onNavigate={handleNavigate} />
        )}

        {currentTab === 'forgot' && (
          <AuthPages mode="forgot" onNavigate={handleNavigate} />
        )}

        {currentTab === 'resident-dashboard' && (
          <ResidentDashboard
            bookings={bookings}
            payments={payments}
            invoices={invoices}
            complaints={complaints}
            notifications={notifications}
            rooms={rooms}
            onRefreshData={refreshAllData}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'admin-panel' && (
          <AdminPanel
            rooms={rooms}
            bookings={bookings}
            payments={payments}
            complaints={complaints}
            policeEscalations={policeEscalations}
            facilities={facilities}
            foodPlans={foodPlans}
            policies={policies}
            gallery={gallery}
            settings={settings}
            onRefreshAll={refreshAllData}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Room Details Modal */}
      <RoomDetailsModal
        room={selectedRoomForModal}
        onClose={() => setSelectedRoomForModal(null)}
        onBook={handleBookRoom}
      />

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} settings={settings} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
