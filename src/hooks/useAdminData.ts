
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
      const { data, error } = await supabase.rpc('has_role', { user_id: userId, role_name: 'admin' });
      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      return data;
    },
    enabled: !!userId,
  });

  const { data: requests, isLoading: requestsLoading, refetch } = useQuery<any[], Error>({
    queryKey: ['creator-requests'],
    queryFn: async () => {
      const { data, error } = await CreatorRequestService.getCreatorRequestsForAdmin();
      if (error) {
        throw new Error('Failed to fetch creator requests');
      }
      return data || [];
    },
    enabled: !!isAdmin,
  });

  return { isAdmin, requests, isLoading: isAdminLoading || (isAdmin && requestsLoading), refetchRequests: refetch };
};
