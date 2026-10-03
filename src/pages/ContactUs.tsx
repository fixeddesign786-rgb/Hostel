import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { HostelSettings } from '../types.ts';
import { LocationCard } from '../components/LocationCard.tsx';
import { api } from '../services/api.ts';

interface ContactUsProps {
  settings: HostelSettings | null;
}

export const ContactUs: React.FC<ContactUsProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const phoneNum = settings?.phone || '+92 300 1234567';
  const whatsappNum = settings?.whatsapp || '+92 300 1234567';
  const emailAddr = settings?.email || 'info@hostelportal.pk';
  const address = settings?.complete_address || 'Plot 48, Street 14, Service Road South, Sector H-12 / I-9';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitting(true);
    try {
      await api.sendContactMessage({ name, email, phone, subject, message });
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold text-xs px-3.5 py-1.5 rounded-full border border-emerald-200">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>DIRECT ADMISSIONS &amp; VISITATION DESK</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F284B] tracking-tight">
          Contact Hostel Administration
        </h1>
        <p className="text-sm text-slate-600">
          Have queries regarding room availability, mess menus, or want to schedule a physical room
          inspection? Reach out to our management team.
        </p>
      </div>

      {/* Grid: Form & Location Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Send an Online Inquiry
          </h2>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900 text-sm">Message Sent Successfully!</h3>
              <p className="text-xs text-emerald-700">
                Our resident warden will reply to your contact number or email within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs font-bold text-emerald-800 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Usman Ghani"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usman@gmail.com"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Mobile / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Room Inquiry for Next Semester"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Message / Requirements *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you are looking for (seater type, move-in date, university)..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting Message...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Location & Visiting Hours */}
        <div className="lg:col-span-5 space-y-6">
          <LocationCard settings={settings} />

          {/* Visiting Hours Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Hostel Visiting &amp; Reception Hours</span>
            </h3>
            <div className="text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Parents &amp; Prospective Residents:</span>
                <span className="font-bold text-slate-800">9:00 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Administration Office:</span>
                <span className="font-bold text-slate-800">8:30 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Emergency Warden Desk:</span>
                <span className="font-bold text-emerald-600">24/7 Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
