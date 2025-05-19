
import { useQueryClient } from '@tanstack/react-query';

export const useEventRefetch = () => {
  const queryClient = useQueryClient();
  
  const refetchEvents = () => {
    // Invalidate all events queries to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ['events'] });
    
    // Also invalidate any specific event queries
    queryClient.invalidateQueries({ queryKey: ['event'] });
  };
  
  return { refetchEvents };
};
