
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import HomePageHeaderSection from '@/components/home/HomePageHeaderSection';
import HomeUpcomingEventsSection from '@/components/home/HomeUpcomingEventsSection';
import HomeHowItWorksSection from '@/components/home/HomeHowItWorksSection';
import HomeCasualPlansSection from '@/components/home/HomeCasualPlansSection';
import HomeCtaSection from '@/components/home/HomeCtaSection';

const Home = () => {
  const { data: events, isLoading } = useEvents();

  return (
    <div className="w-full">
      <HomePageHeaderSection />
      
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HomeUpcomingEventsSection events={events} isLoading={isLoading} />
        </div>
      </div>

      <HomeHowItWorksSection />
      
      <div className="w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HomeCasualPlansSection />
        </div>
      </div>
      
      <HomeCtaSection />
    </div>
  );
};

export default Home;
