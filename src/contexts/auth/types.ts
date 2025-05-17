
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types';

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<{ error: any }>;
  loginWithGoogle: () => Promise<{ error: any }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: any }>;
  resetPassword: (token: string, password: string) => Promise<{ error: any }>;
  isNewUser: boolean;
  setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  updateProfile: (updates: { username: string; avatar_url: string; location: string; status: string; status_details: string; tagline: string }) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}
