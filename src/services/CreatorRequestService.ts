
import { supabase } from '@/lib/supabase';

export const CreatorRequestService = {
  async requestCreatorAccess(userId: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase
      .from('creator_requests')
      .insert({ user_id: userId, status: 'pending' })
      .select()
      .single();

    if (error) {
      console.error('Error requesting creator access:', error);
    }
    return { data, error };
  },

  async getCreatorRequestStatus(userId: string): Promise<{ data: { status: string } | null; error: any }> {
    const { data, error } = await supabase
      .from('creator_requests')
      .select('status')
      .eq('user_id', userId)
      .single();
    
    // PGRST116: No rows found, which is a valid state (user hasn't made a request yet).
    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching creator request status:', error);
        return { data: null, error };
    }

    return { data, error: null };
  },
};
