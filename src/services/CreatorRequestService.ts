
import { supabase } from '@/lib/supabase';

interface CreatorRequestDetails {
  reason: string;
  contact_email?: string;
  contact_phone?: string;
}

interface UserProfileDetails {
  username: string;
  email: string;
}

export const CreatorRequestService = {
  async requestCreatorAccess(userId: string, details: CreatorRequestDetails): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase
      .from('creator_requests')
      .insert({ 
        user_id: userId, 
        status: 'pending',
        reason: details.reason,
        contact_email: details.contact_email || null,
        contact_phone: details.contact_phone || null,
      })
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

  async notifyAdminOfCreatorRequest(userId: string, requestDetails: CreatorRequestDetails, userProfile: UserProfileDetails): Promise<{ error: any }> {
    const { error } = await supabase
      .from('admin_notifications')
      .insert({
        notification_type: 'creator_request',
        data: {
          user_id: userId,
          username: userProfile.username,
          user_email: userProfile.email,
          ...requestDetails,
        }
      });

    if (error) {
      console.error('Error creating admin notification for creator request:', error);
    }
    
    return { error };
  }
};
