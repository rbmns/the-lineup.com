
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CreatorRequestService } from '@/services/CreatorRequestService';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminData = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const { data: isAdmin, isLoading: isAdminLoading } = useQuery<boolean, Error>({
    queryKey: ['user-role', userId, 'admin'],
    queryFn: async () => {
      if (!userId) return false;
      console.log('useAdminData: Checking admin role for user:', userId);
      const { data, error } = await supabase.rpc('has_role', { user_id: userId, role_name: 'admin' });
      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      console.log('Admin check result:', data);
      return data;
    },
    enabled: !!userId,
  });

  const { data: requests, isLoading: requestsLoading, refetch } = useQuery<any[], Error>({
    queryKey: ['creator-requests'],
    queryFn: async () => {
      console.log('useAdminData: Fetching creator requests for admin...');
      
      // First try to get requests from admin_notifications (the preferred way)
      const { data: notificationRequests, error: notificationError } = await CreatorRequestService.getCreatorRequestsForAdmin();
      if (notificationError) {
        console.error('Error fetching creator requests from notifications:', notificationError);
      } else {
        console.log('Notification-based requests fetched:', notificationRequests?.length || 0);
      }
      
      // Also get all creator requests directly from the creator_requests table
      // Fix the query by removing the incorrect foreign key reference
      const { data: directRequests, error: directError } = await supabase
        .from('creator_requests')
        .select(`
          id,
          user_id,
          status,
          reason,
          contact_email,
          contact_phone,
          created_at
        `)
        .order('created_at', { ascending: false });
      
      if (directError) {
        console.error('Error fetching direct creator requests:', directError);
        throw new Error('Failed to fetch creator requests');
      }
      
      console.log('Direct creator_requests table data:', directRequests);
      
      // Get user profiles separately to avoid the foreign key issue
      const userIds = directRequests?.map(req => req.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, email')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }
      
      // Convert direct requests to the same format as notification requests
      const formattedDirectRequests = directRequests?.map(request => {
        const userProfile = profiles?.find(p => p.id === request.user_id);
        return {
          id: `creator_request_${request.id}`, // Prefix to distinguish from notification IDs
          created_at: request.created_at,
          is_read: request.status !== 'pending', // Mark as read if not pending
          data: {
            user_id: request.user_id,
            username: userProfile?.username || 'Unknown',
            user_email: userProfile?.email || 'No email',
            reason: request.reason || 'No reason provided',
            contact_email: request.contact_email,
            contact_phone: request.contact_phone,
          },
          original_request_id: request.id, // Store the original creator_requests ID
          status: request.status
        };
      }) || [];
      
      // Combine both sources, preferring notification-based requests
      const notificationUserIds = new Set(notificationRequests?.map(req => req.data?.user_id) || []);
      const uniqueDirectRequests = formattedDirectRequests.filter(req => !notificationUserIds.has(req.data.user_id));
      
      const allRequests = [
        ...(notificationRequests || []),
        ...uniqueDirectRequests
      ];
      
      console.log('Combined creator requests:', allRequests.length);
      console.log('Combined requests data:', allRequests);
      
      return allRequests;
    },
    enabled: !!isAdmin,
  });

  return { 
    isAdmin, 
    requests, 
    isLoading: isAdminLoading || (isAdmin && requestsLoading), 
    refetchRequests: refetch 
  };
};
