
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { PublicHome } from '@/components/home/PublicHome';
import { filterUpcomingEvents } from '@/utils/dateUtils';
import { pageSeoTags } from '@/utils/seoUtils';

const Home = () => {
  const { user } = useAuth();
  const { data: events, isLoading } = useEvents(user?.id);
  
  // Update SEO tags for home page
  useEffect(() => {
    document.title = pageSeoTags.home.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageSeoTags.home.description);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) ogTitle.setAttribute('content', pageSeoTags.home.title);
    if (ogDesc) ogDesc.setAttribute('content', pageSeoTags.home.description);
  }, []);
  
  // Add debug logging
  useEffect(() => {
    console.log('Home page rendering with user:', user?.id);
    console.log('Events loading status:', isLoading);
    console.log('Events data available:', events?.length || 0);
  }, [user?.id, isLoading, events]);
  
  const upcomingEvents = events ? filterUpcomingEvents(events) : [];

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 py-2 sm:py-4 md:py-8">
      <PublicHome 
        events={upcomingEvents} 
        isLoading={isLoading} 
        showFilters={false} 
      />
    </div>
  );
};

export default Home;
