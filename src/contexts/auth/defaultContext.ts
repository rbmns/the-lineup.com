
import { AuthContextType } from './types';

export const defaultAuthContext: AuthContextType = {
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null, data: null }),
  signOut: async () => {},
  loginWithEmail: async () => ({ error: null }),
  loginWithGoogle: async () => ({ error: null }),
  logout: async () => {},
  forgotPassword: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  isNewUser: false,
  setIsNewUser: () => {},
  updateProfile: async () => ({ error: null }),
  refreshProfile: async () => {},
};
