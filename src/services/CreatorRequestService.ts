
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

      // Send admin notification (both in-app and email)
      console.log('CreatorRequestService: Starting admin notification process...');
      const notificationResult = await this.notifyAdminOfCreatorRequest(userId, details, {
        username: userProfile.username || 'Unknown',
        email: userProfile.email || 'No email'
      });

      if (notificationResult.error) {
        console.error('CreatorRequestService: Admin notification failed:', notificationResult.error);
        // Don't fail the whole process if notification fails, but log it clearly
        console.error('CreatorRequestService: Creator request was saved but admin notification failed!');
      } else {
        console.log('CreatorRequestService: Admin notification completed successfully');
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

  async notifyAdminOfCreatorRequest(userId: string, requestDetails: CreatorRequestDetails, userProfile: UserProfileDetails): Promise<{ error: any }> {
    console.log('CreatorRequestService: notifyAdminOfCreatorRequest called with:', {
      userId,
      userProfile,
      requestDetails
    });
    
    try {
      // Create in-app notification
      console.log('CreatorRequestService: Creating admin notification in database...');
      const notificationData = {
        notification_type: 'creator_request',
        data: {
          user_id: userId,
          username: userProfile.username,
          user_email: userProfile.email,
          reason: requestDetails.reason,
          contact_email: requestDetails.contact_email,
          contact_phone: requestDetails.contact_phone,
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
        console.error('CreatorRequestService: Notification error details:', {
          code: notificationError.code,
          message: notificationError.message,
          details: notificationError.details,
          hint: notificationError.hint
        });
      } else {
        console.log('CreatorRequestService: Admin notification created successfully:', insertedNotification);
      }
      
      // Send email notification via edge function
      console.log('CreatorRequestService: Calling email notification edge function...');
      try {
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
          console.error('CreatorRequestService: Email notification function error:', functionError);
        } else {
          console.log('CreatorRequestService: Email notification function success:', functionData);
        }
      } catch (emailError) {
        console.error('CreatorRequestService: Email notification threw exception:', emailError);
      }
      
      return { error: notificationError };
      
    } catch (unexpectedError) {
      console.error('CreatorRequestService: Unexpected error in notifyAdminOfCreatorRequest:', unexpectedError);
      return { error: unexpectedError };
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
