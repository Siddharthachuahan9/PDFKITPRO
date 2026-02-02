'use client';

import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { User, PlanType } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (provider?: string) => Promise<void>;
  signOut: () => Promise<void>;
  upgradePlan: (plan: PlanType) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PLAN_STORAGE_KEY = 'pdfkit-user-plan';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<PlanType>('free');

  // Load plan from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(PLAN_STORAGE_KEY);
    if (stored && ['free', 'pro', 'business'].includes(stored)) {
      setPlan(stored as PlanType);
    }
  }, []);

  const user = session?.user
    ? {
        id: session.user.id || session.user.email || 'unknown',
        email: session.user.email || '',
        name: session.user.name || undefined,
        plan,
        createdAt: new Date(),
      }
    : null;

  const signIn = useCallback(async (provider?: string) => {
    await nextAuthSignIn(provider, { callbackUrl: '/dashboard' });
  }, []);

  const signOut = useCallback(async () => {
    await nextAuthSignOut({ callbackUrl: '/' });
  }, []);

  const upgradePlan = useCallback((newPlan: PlanType) => {
    setPlan(newPlan);
    localStorage.setItem(PLAN_STORAGE_KEY, newPlan);
    // In production, this would also update the database via API
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    signIn,
    signOut,
    upgradePlan,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default context for server-side rendering or when outside provider
    return {
      user: null,
      isLoading: true,
      isAuthenticated: false,
      signIn: async () => {},
      signOut: async () => {},
      upgradePlan: () => {},
    };
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

// Hook for checking if user has access to a feature
export function useFeatureAccess(feature: string): boolean {
  const plan = usePlan();

  const featureAccess: Record<string, PlanType[]> = {
    ai: ['pro', 'business'],
    cloud: ['pro', 'business'],
    teams: ['business'],
    redact: ['pro', 'business'],
    compare: ['pro', 'business'],
    ocr: ['pro', 'business'],
    watermark: ['free', 'pro', 'business'],
    merge: ['free', 'pro', 'business'],
    split: ['free', 'pro', 'business'],
    compress: ['free', 'pro', 'business'],
  };

  const allowedPlans = featureAccess[feature] || ['free', 'pro', 'business'];
  return allowedPlans.includes(plan);
}
