
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
      const { data, error } = await CreatorRequestService.getCreatorRequestsForAdmin();
      if (error) {
        console.error('Error fetching creator requests:', error);
        throw new Error('Failed to fetch creator requests');
      }
      console.log('Creator requests fetched:', data?.length || 0);
      console.log('Creator requests data:', data);
      
      // Let's also check if there are any creator_requests in the database directly
      const { data: directRequests, error: directError } = await supabase
        .from('creator_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (directError) {
        console.error('Error fetching direct creator requests:', directError);
      } else {
        console.log('Direct creator_requests table data:', directRequests);
      }
      
      return data || [];
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
