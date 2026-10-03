import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Shield, Lock, Mail, User, Phone, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { UserRole } from '../types.ts';

interface AuthPageProps {
  mode: 'login' | 'register' | 'forgot';
  onNavigate: (tab: string) => void;
}

export const AuthPages: React.FC<AuthPageProps> = ({ mode, onNavigate }) => {
  const { login, register, switchRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const u = await login(email, password);
      if (u.role === 'STUDENT') {
        onNavigate('resident-dashboard');
      } else {
        onNavigate('admin-panel');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg('Name, email, and password are required.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await register({ full_name: fullName, email, password, phone, cnic, address });
      onNavigate('resident-dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setForgotSuccess(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#0F284B] rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#0F284B] tracking-tight">
            {mode === 'login' && 'Sign In to Portal'}
            {mode === 'register' && 'Resident Registration'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'login' && 'Access resident invoices, booking status & maintenance complaints'}
            {mode === 'register' && 'Create your account to book and manage your room online'}
            {mode === 'forgot' && 'Enter your registered email to receive password reset link'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="resident@student.pk"
                  className="w-full text-xs border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot')}
                  className="text-[11px] text-emerald-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>

            {/* 1-Click Quick Demo Accounts Bar */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-2 text-center">
                Instant Demo Access (1-Click Switch)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('ali.hamza@student.pk');
                    setPassword('Student@123');
                  }}
                  className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-left transition border border-emerald-200"
                >
                  <div className="text-[10px] text-emerald-600 uppercase">Resident</div>
                  <div>Ali Hamza</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('manager@hostelportal.pk');
                    setPassword('Admin@123');
                  }}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold text-left transition border border-blue-200"
                >
                  <div className="text-[10px] text-blue-600 uppercase">Admin / Manager</div>
                  <div>Hostel Admin</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@hostelportal.pk');
                    setPassword('Admin@123');
                  }}
                  className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold text-left transition border border-purple-200"
                >
                  <div className="text-[10px] text-purple-600 uppercase">Super Admin</div>
                  <div>Tariq Khan</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('security@hostelportal.pk');
                    setPassword('Admin@123');
                  }}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-left transition border border-slate-300"
                >
                  <div className="text-[10px] text-slate-500 uppercase">Security Head</div>
                  <div>Farooq Azam</div>
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Don&apos;t have an account yet? </span>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Register as Resident
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Bilal Hassan"
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
                placeholder="bilal@gmail.com"
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Mobile / WhatsApp Number *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 0000000"
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                CNIC Number *
              </label>
              <input
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                placeholder="35201-XXXXXXX-X"
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Choose Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Create Account & Proceed'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Already registered? </span>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            {forgotSuccess ? (
              <div className="text-center space-y-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">Reset Instructions Sent</h4>
                <p className="text-xs text-emerald-700">
                  If an account exists for {email}, a recovery link has been dispatched.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-xs font-bold text-emerald-800 underline block mx-auto"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Registered Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="resident@email.com"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0F284B] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Send Recovery Link
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="text-xs text-slate-600 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
