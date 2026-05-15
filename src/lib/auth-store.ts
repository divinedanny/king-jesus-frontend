import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authApi } from './api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      loginWithGoogle: async (idToken: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.googleLogin(idToken);
          // Store the token
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', response.token);
          }
          get().setUser(response.user);
        } catch (error) {
          get().setError(error instanceof Error ? error.message : 'Login failed');
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await authApi.logout();
        } catch (error) {
          // Ignore logout errors, still clear local state
          console.error('Logout API error:', error);
        } finally {
          authApi.clearToken();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }
        
        set({ isLoading: true });
        
        try {
          const user = await authApi.getProfile();
          get().setUser(user);
        } catch (error) {
          // Token invalid or expired
          console.error('Auth check failed:', error);
          get().logout();
        }
      },
    }),
    {
      name: 'king-jesus-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
