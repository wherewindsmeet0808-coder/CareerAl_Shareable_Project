import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../api/client';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'admin';
  education_level?: string;
  degree?: string;
  specialization?: string;
  graduation_year?: number;
  skills?: string[];
  interests?: string[];
  experience_level?: string;
  preferred_role?: string;
  preferred_location?: string;
  preferred_work_mode?: 'onsite' | 'hybrid' | 'remote';
  preferred_language?: 'en' | 'ta';
  created_at?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ai_career_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize and check current user
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await apiRequest<{ user: UserProfile }>('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        // Token expired or invalid
        localStorage.removeItem('ai_career_token');
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await apiRequest<{ token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (res.success && res.token && res.user) {
      localStorage.setItem('ai_career_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'Login failed' };
  };

  const register = async (data: any) => {
    const res = await apiRequest<{ token: string; user: UserProfile }>('/auth/register', {
      method: 'POST',
      body: data,
    });

    if (res.success && res.token && res.user) {
      localStorage.setItem('ai_career_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'Registration failed' };
  };

  const logout = () => {
    localStorage.removeItem('ai_career_token');
    setToken(null);
    setUser(null);
    apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const res = await apiRequest<{ user: UserProfile }>('/auth/profile', {
      method: 'PUT',
      body: updates,
    });

    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'Update failed' };
  };

  const refreshProfile = async () => {
    if (!token) return;
    const res = await apiRequest<{ user: UserProfile }>('/auth/me');
    if (res.success && res.user) {
      setUser(res.user);
    }
  };

  const deleteAccount = async () => {
    const res = await apiRequest('/auth/account', { method: 'DELETE' });
    if (res.success) {
      localStorage.removeItem('ai_career_token');
      setToken(null);
      setUser(null);
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to delete account' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
        deleteAccount,
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
