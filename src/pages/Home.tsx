import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from './LandingPage';

const Home = () => {
  const { user } = useAuth();
  
  // Use query to fetch events data but won't display it now - keeping for future use
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
  
  // Instead of rendering PublicHome, now render our new LandingPage
  return <LandingPage />;
  
  // Preserving original return for future reference:
  // return (
  //   <div className="min-h-screen">
  //     <PublicHome 
  //       events={events || []} 
  //       isLoading={isLoading} 
  //       showSearch={true}
  //       showFilters={true}
  //     />
  //   </div>
  // );
};

export default Home;
