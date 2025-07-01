
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/services/UserService';
import { CreatorRequestService } from '@/services/CreatorRequestService';

export const useCreatorStatus = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['userRoles', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await UserService.getUserRoles(userId);
      return data || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: requestStatusData, isLoading: statusLoading } = useQuery({
    queryKey: ['creatorRequestStatus', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await CreatorRequestService.getCreatorRequestStatus(userId);
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const isLoading = rolesLoading || statusLoading;

  const isAdmin = roles?.includes('admin') || false;
  const isCreator = roles?.includes('event_creator') || false;

  // Allow any authenticated user to create events
  // The database RLS policies handle the actual security
  const canCreateEvents = !!user;
  const creatorRequestStatus = requestStatusData?.status || 'not_requested';
  
  return {
    isLoading,
    isAdmin,
    canCreateEvents,
    creatorRequestStatus,
  };
};
