
import React from 'react';
import { PublicHome } from '@/components/home/PublicHome';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  
  // Use query to fetch events data
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      console.log('Fetching events for user:', user);
      // For now, return empty array as we don't have the actual fetch implementation
      return [];
    },
    enabled: true, // Always fetch events regardless of user auth state
  });
  
  console.log('Home page rendering with user:', user);
  console.log('Events loading status:', isLoading);
  console.log('Events data available:', events?.length || 0);

  return (
    <div className="min-h-screen">
      <PublicHome 
        events={events || []} 
        isLoading={isLoading} 
        showSearch={true}
        showFilters={true}
      />
    </div>
  );
};

export default Home;
