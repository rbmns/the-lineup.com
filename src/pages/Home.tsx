
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import HomePageHeaderSection from '@/components/home/HomePageHeaderSection';
import { PublicHome } from '@/components/home/PublicHome';
import HomeCtaSection from '@/components/home/HomeCtaSection';
import HomeHowItWorksSection from '@/components/home/HomeHowItWorksSection';

const Home = () => {
  const { data: events, isLoading } = useEvents();

  return (
    <div className="w-full">
      <HomePageHeaderSection />
      
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PublicHome events={events} isLoading={isLoading} />
        </div>
      </div>

      <HomeHowItWorksSection />
      <HomeCtaSection />
    </div>
  );
};

export default Home;
