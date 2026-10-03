import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('hostel_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('hostel_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          setToken(storedToken);
        } catch {
          // If token expired or invalid, default to demo resident
          localStorage.removeItem('hostel_token');
          setToken(null);
          setUser(null);
        }
      } else {
        // Pre-select student Ali Hamza for smooth initial experience if wanted
        const demoStored = localStorage.getItem('hostel_demo_user');
        if (demoStored) {
          try {
            const parsed = JSON.parse(demoStored);
            setUser(parsed);
            setToken(parsed.id);
            localStorage.setItem('hostel_token', parsed.id);
          } catch {}
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password = 'password') => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('hostel_token', res.token);
      localStorage.setItem('hostel_demo_user', JSON.stringify(res.user));
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('hostel_token', res.token);
      localStorage.setItem('hostel_demo_user', JSON.stringify(res.user));
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hostel_token');
    localStorage.removeItem('hostel_demo_user');
  };

  const switchRole = async (role: UserRole) => {
    setIsLoading(true);
    try {
      let targetEmail = 'ali.hamza@student.pk';
      if (role === 'SUPER_ADMIN') targetEmail = 'admin@hostelportal.pk';
      else if (role === 'HOSTEL_ADMIN' || role === 'MANAGER') targetEmail = 'manager@hostelportal.pk';
      else if (role === 'SECURITY') targetEmail = 'security@hostelportal.pk';
      else if (role === 'STUDENT') targetEmail = 'ali.hamza@student.pk';

      const res = await api.login({ email: targetEmail, password: role === 'STUDENT' ? 'Student@123' : 'Admin@123' });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('hostel_token', res.token);
      localStorage.setItem('hostel_demo_user', JSON.stringify(res.user));
    } catch (err) {
      console.error('Role switch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      setUser(res.user);
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
