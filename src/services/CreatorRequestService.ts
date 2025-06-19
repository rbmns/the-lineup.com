
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
    console.log('CreatorRequestService: Starting request for userId:', userId);
    console.log('CreatorRequestService: Request details:', details);

    // First, get user profile information
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('username, email')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { data: null, error: profileError };
    }

    console.log('CreatorRequestService: User profile fetched:', userProfile);

    // Create the creator request
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
      console.error('Error creating creator request:', error);
      return { data: null, error };
    }

    console.log('CreatorRequestService: Creator request created:', data);

    // Send admin notification (both in-app and email)
    const notificationResult = await this.notifyAdminOfCreatorRequest(userId, details, {
      username: userProfile.username || 'Unknown',
      email: userProfile.email || 'No email'
    });

    if (notificationResult.error) {
      console.error('Error sending admin notification:', notificationResult.error);
      // Don't fail the whole process if notification fails
    }

    return { data, error: null };
  },

  async getCreatorRequestStatus(userId: string): Promise<{ data: { status: string } | null; error: any }> {
    console.log('CreatorRequestService: Checking status for userId:', userId);
    
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

    console.log('CreatorRequestService: Status check result:', data);
    return { data, error: null };
  },

  async notifyAdminOfCreatorRequest(userId: string, requestDetails: CreatorRequestDetails, userProfile: UserProfileDetails): Promise<{ error: any }> {
    console.log('CreatorRequestService: Creating admin notification for:', userProfile);
    
    // Create in-app notification
    const { data: notificationData, error: notificationError } = await supabase
      .from('admin_notifications')
      .insert({
        notification_type: 'creator_request',
        data: {
          user_id: userId,
          username: userProfile.username,
          user_email: userProfile.email,
          ...requestDetails,
        }
      })
      .select()
      .single();

    if (notificationError) {
      console.error('Error creating admin notification:', notificationError);
    } else {
      console.log('Admin notification created successfully:', notificationData);
    }
    
    // Send email notification via edge function
    console.log('CreatorRequestService: Calling email notification edge function...');
    const { data: functionData, error: functionError } = await supabase.functions.invoke('notify-admin-creator-request', {
        body: {
          username: userProfile.username,
          user_email: userProfile.email,
          reason: requestDetails.reason,
          contact_email: requestDetails.contact_email,
          contact_phone: requestDetails.contact_phone,
        }
    });

    if (functionError) {
      console.error('Error invoking email notification function:', functionError);
    } else {
      console.log('Email notification function called successfully:', functionData);
    }
    
    return { error: notificationError || functionError };
  },

  async getCreatorRequestsForAdmin(): Promise<{ data: any[] | null; error: any }> {
    console.log('CreatorRequestService: Fetching creator requests for admin...');
    
    const { data, error } = await supabase
      .from('admin_notifications')
      .select('id, created_at, is_read, data')
      .eq('notification_type', 'creator_request')
      .order('is_read', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching creator requests for admin:', error);
    } else {
      console.log('Admin creator requests fetched:', data?.length || 0, 'requests');
    }
    
    return { data, error };
  },

  async approveCreatorRequest(userId: string, notificationId: string): Promise<{ error: any }> {
    console.log('CreatorRequestService: Approving request for userId:', userId, 'notificationId:', notificationId);
    
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

    console.log('Creator request approved successfully');
    return { error: null };
  },

  async denyCreatorRequest(userId: string, notificationId: string): Promise<{ error: any }> {
    console.log('CreatorRequestService: Denying request for userId:', userId, 'notificationId:', notificationId);
    
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

    console.log('Creator request denied successfully');
    return { error: null };
  }
};
