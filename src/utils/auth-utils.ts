
import { supabase } from '@/lib/supabase';

export const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Unexpected logout error:', error);
    throw error;
  }
};

export const checkAuthStatus = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Auth status check error:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Unexpected auth status error:', error);
    return null;
  }
};
