import { vi } from 'vitest';
import type { User } from '@supabase/supabase-js';

// Mock user for testing
const mockUser: User = {
  id: 'mock-user-id',
  email: 'test@example.com',
  user_metadata: {},
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  email_confirmed_at: '2024-01-01T00:00:00.000Z',
  last_sign_in_at: '2024-01-01T00:00:00.000Z',
  role: 'authenticated',
  confirmation_sent_at: '2024-01-01T00:00:00.000Z',
  confirmed_at: '2024-01-01T00:00:00.000Z',
  recovery_sent_at: null,
  email_change_sent_at: null,
  new_email: null,
  invited_at: null,
  action_link: null,
  phone: null,
  phone_confirmed_at: null,
  new_phone: null,
  factors: null,
  identities: null,
};

export const mockAuthContext = {
  user: mockUser,
  session: {
    user: mockUser,
    access_token: 'mock-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    expires_at: Date.now() + 3600000,
  },
  profile: {
    id: 'mock-user-id',
    username: 'testuser',
    email: 'test@example.com',
    avatar_url: [],
    location: 'Test City',
    location_category: 'City',
    status: 'Active',
    status_details: '',
    tagline: 'Test tagline',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  isAuthenticated: true,
  loading: false,
  isNewUser: false,
  setIsNewUser: vi.fn(),
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  loginWithEmail: vi.fn(),
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  updateProfile: vi.fn(),
  refreshProfile: vi.fn(),
};

// Mock the entire AuthContext module
vi.mock('@/contexts/AuthContext', () => ({
  AuthContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
  useAuth: () => mockAuthContext,
}));