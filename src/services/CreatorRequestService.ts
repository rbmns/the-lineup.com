
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

    try {
      // First, get user profile information
      console.log('CreatorRequestService: Fetching user profile...');
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

      // Check if request already exists for this user
      console.log('CreatorRequestService: Checking for existing request...');
      const { data: existingRequest, error: checkError } = await supabase
        .from('creator_requests')
        .select('id, status')
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) {
        console.error('CreatorRequestService: Error checking existing request:', checkError);
        return { data: null, error: checkError };
      }

      if (existingRequest) {
        console.log('CreatorRequestService: Found existing request:', existingRequest);
        return { data: existingRequest, error: null };
      }

      // Create the creator request
      console.log('CreatorRequestService: Creating creator request...');
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

      console.log('CreatorRequestService: Creator request created successfully:', data);

      // Create admin notification immediately
      console.log('CreatorRequestService: Creating admin notification...');
      const notificationData = {
        notification_type: 'creator_request',
        data: {
          user_id: userId,
          username: userProfile.username || 'Unknown',
          user_email: userProfile.email || 'No email',
          reason: details.reason,
          contact_email: details.contact_email,
          contact_phone: details.contact_phone,
        }
      };
      
      console.log('CreatorRequestService: Notification data to insert:', notificationData);
      
      const { data: insertedNotification, error: notificationError } = await supabase
        .from('admin_notifications')
        .insert(notificationData)
        .select()
        .single();

      if (notificationError) {
        console.error('CreatorRequestService: Failed to create admin notification:', notificationError);
        // Don't fail the whole request, just log the error
      } else {
        console.log('CreatorRequestService: Admin notification created successfully:', insertedNotification);
      }

      // Try to send email notification (optional, don't fail if it doesn't work)
      try {
        console.log('CreatorRequestService: Attempting to send email notification...');
        const { data: functionData, error: functionError } = await supabase.functions.invoke('notify-admin-creator-request', {
          body: {
            username: userProfile.username,
            user_email: userProfile.email,
            reason: details.reason,
            contact_email: details.contact_email,
            contact_phone: details.contact_phone,
          }
        });

        if (functionError) {
          console.error('CreatorRequestService: Email notification function error:', functionError);
        } else {
          console.log('CreatorRequestService: Email notification function success:', functionData);
        }
      } catch (emailError) {
        console.error('CreatorRequestService: Email notification threw exception:', emailError);
      }

      return { data, error: null };
    } catch (unexpectedError) {
      console.error('CreatorRequestService: Unexpected error in requestCreatorAccess:', unexpectedError);
      return { data: null, error: unexpectedError };
    }
  },

  async getCreatorRequestStatus(userId: string): Promise<{ data: { status: string } | null; error: any }> {
    console.log('CreatorRequestService: Checking status for userId:', userId);
    
    try {
      const { data, error } = await supabase
        .from('creator_requests')
        .select('status')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching creator request status:', error);
        return { data: null, error };
      }

      console.log('CreatorRequestService: Status check result:', data);
      return { data, error: null };
    } catch (unexpectedError) {
      console.error('CreatorRequestService: Unexpected error in getCreatorRequestStatus:', unexpectedError);
      return { data: null, error: unexpectedError };
    }
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
      console.log('Admin creator requests details:', data);
    }
    
    return { data, error };
  },

  async approveCreatorRequest(userId: string, notificationId: string): Promise<{ error: any }> {
    console.log('CreatorRequestService: Approving request for userId:', userId, 'notificationId:', notificationId);
    
    try {
      // 1. Grant event_creator role
      console.log('CreatorRequestService: Granting event_creator role...');
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'event_creator' });

      if (roleError && roleError.code !== '23505') { // 23505 is unique_violation
        console.error('Error granting event_creator role:', roleError);
        return { error: roleError };
      }

      // 2. Update request status to approved
      console.log('CreatorRequestService: Updating request status to approved...');
      const { error: requestError } = await supabase
        .from('creator_requests')
        .update({ status: 'approved' })
        .eq('user_id', userId);

      if (requestError) {
        console.error('Error updating creator request status to approved:', requestError);
        return { error: requestError };
      }

      // 3. Mark notification as read (if it exists)
      if (!notificationId.startsWith('creator_request_')) {
        console.log('CreatorRequestService: Marking notification as read...');
        const { error: notificationError } = await supabase
          .from('admin_notifications')
          .update({ is_read: true })
          .eq('id', notificationId);
          
        if (notificationError) {
            console.error('Error updating notification status:', notificationError);
        }
      }

      console.log('Creator request approved successfully');
      return { error: null };
    } catch (error) {
      console.error('CreatorRequestService: Error in approveCreatorRequest:', error);
      return { error };
    }
  },

  async denyCreatorRequest(userId: string, notificationId: string): Promise<{ error: any }> {
    console.log('CreatorRequestService: Denying request for userId:', userId, 'notificationId:', notificationId);
    
    try {
      // 1. Update request status to denied
      console.log('CreatorRequestService: Updating request status to denied...');
      const { error: requestError } = await supabase
        .from('creator_requests')
        .update({ status: 'denied' })
        .eq('user_id', userId);

      if (requestError) {
        console.error('Error updating creator request status to denied:', requestError);
        return { error: requestError };
      }

      // 2. Mark notification as read (if it exists)
      if (!notificationId.startsWith('creator_request_')) {
        console.log('CreatorRequestService: Marking notification as read...');
        const { error: notificationError } = await supabase
          .from('admin_notifications')
          .update({ is_read: true })
          .eq('id', notificationId);
          
        if (notificationError) {
            console.error('Error updating notification status:', notificationError);
        }
      }

      console.log('Creator request denied successfully');
      return { error: null };
    } catch (error) {
      console.error('CreatorRequestService: Error in denyCreatorRequest:', error);
      return { error };
    }
  }
};
