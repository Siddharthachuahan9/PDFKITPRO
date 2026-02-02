'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { User, PlanType } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string) => Promise<void>;
  logout: () => void;
  upgradePlan: (plan: PlanType) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'pdfkit-user';

// Demo user for local development
const createDemoUser = (plan: PlanType = 'free'): User => ({
  id: 'demo-user',
  email: 'demo@pdfkit.pro',
  plan,
  createdAt: new Date(),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const user = JSON.parse(stored) as User;
        setState({ user, isLoading: false, isAuthenticated: true });
      } catch {
        setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    } else {
      // Auto-create demo user for local-first experience
      const demoUser = createDemoUser('free');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
      setState({ user: demoUser, isLoading: false, isAuthenticated: true });
    }
  }, []);

  const login = useCallback(async (email: string) => {
    // In production, this would call the auth API
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      plan: 'free',
      createdAt: new Date(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setState({ user, isLoading: false, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  const upgradePlan = useCallback((plan: PlanType) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, plan };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, upgradePlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

export function usePlan(): PlanType {
  const { user } = useAuth();
  return user?.plan ?? 'free';
}
