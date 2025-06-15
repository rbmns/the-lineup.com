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
    const { error: notificationError } = await supabase
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

    if (notificationError) {
      console.error('Error creating admin notification for creator request:', notificationError);
    }
    
    // Temporarily disabled due to deployment issues.
    // Invoke the edge function to send an email notification
    // const { error: functionError } = await supabase.functions.invoke('notify-admin-creator-request', {
    //     body: {
    //       username: userProfile.username,
    //       user_email: userProfile.email,
    //       ...requestDetails,
    //     }
    // });

    // if (functionError) {
    //   console.error('Error invoking email notification function:', functionError);
    //   // We don't block the user's flow if email fails. The in-app notification is the primary source.
    // }
    
    return { error: notificationError };
  },

  async getCreatorRequestsForAdmin(): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await supabase
      .from('admin_notifications')
      .select('id, created_at, is_read, data')
      .eq('notification_type', 'creator_request')
      .order('is_read', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching creator requests for admin:', error);
    }
    return { data, error };
  },

  async approveCreatorRequest(userId: string, notificationId: string): Promise<{ error: any }> {
    // 1. Grant event_creator role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'event_creator' });

    if (roleError && roleError.code !== '23505') { // 23505 is unique_violation
      console.error('Error granting event_creator role:', roleError);
      return { error: roleError };
    }

    // 2. Update request status to approved
    const { error: requestError } = await supabase
      .from('creator_requests')
      .update({ status: 'approved' })
      .eq('user_id', userId);

    if (requestError) {
      console.error('Error updating creator request status to approved:', requestError);
      return { error: requestError };
    }

    // 3. Mark notification as read
    const { error: notificationError } = await supabase
      .from('admin_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
      
    if (notificationError) {
        console.error('Error updating notification status:', notificationError);
    }

    return { error: null };
  },

  async denyCreatorRequest(userId: string, notificationId: string): Promise<{ error: any }> {
    // 1. Update request status to denied
    const { error: requestError } = await supabase
      .from('creator_requests')
      .update({ status: 'denied' })
      .eq('user_id', userId);

    if (requestError) {
      console.error('Error updating creator request status to denied:', requestError);
      return { error: requestError };
    }

    // 2. Mark notification as read
    const { error: notificationError } = await supabase
      .from('admin_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
      
    if (notificationError) {
        console.error('Error updating notification status:', notificationError);
    }

    return { error: null };
  }
};
