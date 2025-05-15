
import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes - reduced from 5 minutes to catch 30-minute cutoffs more frequently
      retry: 1,
    },
  },
});
