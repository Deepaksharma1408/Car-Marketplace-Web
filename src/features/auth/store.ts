import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';
import { DEMO_USERS } from '@/mocks/users';

interface AuthState {
  role: UserRole;
  user: User | null;
  isAuthenticated: boolean;
  activeOtpCode: string | null;
  otpRecipient: string | null;
  switchRole: (role: UserRole) => void;
  loginWithDemoAccount: (role: UserRole) => void;
  login: (email: string) => Promise<{ success: boolean; error?: string }>;
  sendOtp: (recipient: string) => { code: string };
  verifyOtp: (code: string) => Promise<boolean>;
  signup: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  deleteAccount: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Default initial role: Individual Seller for instant interactive richness
      role: 'individual',
      user: DEMO_USERS[1], // Hamdan Al-Maktoum
      isAuthenticated: true,
      activeOtpCode: null,
      otpRecipient: null,

      switchRole: (targetRole: UserRole) => {
        if (targetRole === 'guest') {
          set({
            role: 'guest',
            user: null,
            isAuthenticated: false,
          });
          return;
        }

        let targetUser = DEMO_USERS.find(u => u.role === targetRole);
        if (!targetUser) {
          targetUser = DEMO_USERS[1];
        }

        set({
          role: targetRole,
          user: targetUser,
          isAuthenticated: true,
        });
      },

      loginWithDemoAccount: (targetRole: UserRole) => {
        get().switchRole(targetRole);
      },

      login: async (email: string) => {
        // Find matching user or fallback to standard demo user
        const matchedUser = DEMO_USERS.find(
          u => u.email.toLowerCase() === email.toLowerCase()
        ) || (email.includes('admin') ? DEMO_USERS[0] : email.includes('dealer') ? DEMO_USERS[2] : DEMO_USERS[1]);

        set({
          role: matchedUser.role,
          user: matchedUser,
          isAuthenticated: true,
        });

        return { success: true };
      },

      sendOtp: (recipient: string) => {
        // Generate random 6-digit mock OTP code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        set({
          activeOtpCode: code,
          otpRecipient: recipient,
        });
        return { code };
      },

      verifyOtp: async (code: string) => {
        const { activeOtpCode } = get();
        // Allow the exact generated code OR universal test code '123456'
        if (code === activeOtpCode || code === '123456') {
          set({
            activeOtpCode: null,
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      signup: async (userData: Partial<User>) => {
        const newUser: User = {
          id: `user_custom_${Date.now()}`,
          name: userData.name || 'New Member',
          email: userData.email || 'user@vehiclespot.ae',
          role: userData.role || 'individual',
          avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop',
          phone: userData.phone || '+971 50 000 0000',
          companyName: userData.companyName,
          tradeLicenseNumber: userData.tradeLicenseNumber,
          tradeLicenseExpiry: userData.tradeLicenseExpiry,
          isVerifiedDealer: false,
          savedListings: [],
          createdAt: new Date().toISOString(),
        };

        set({
          role: newUser.role,
          user: newUser,
          isAuthenticated: true,
        });

        return true;
      },

      logout: () => {
        set({
          role: 'guest',
          user: null,
          isAuthenticated: false,
          activeOtpCode: null,
          otpRecipient: null,
        });
      },

      updateCurrentUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, ...updates };
        set({ user: updated });
      },

      deleteAccount: () => {
        set({
          role: 'guest',
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'vehiclespot_auth_v2',
      skipHydration: true,
    }
  )
);
