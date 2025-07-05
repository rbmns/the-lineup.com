
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import HomeHowItWorksSection from '@/components/home/HomeHowItWorksSection';
import { HomeEventsPreview } from '@/components/home/HomeEventsPreview';
import { HomeCasualPlansSection } from '@/components/home/HomeCasualPlansSection';

const Home = () => {
  const { data: events, isLoading } = useEvents(undefined, { includeAllStatuses: true });

  return (
    <div className="w-full bg-pure-white min-h-screen text-graphite-grey">
      {/* Hero Section - flows naturally */}
      <div className="w-full">
        <HomeHeroSection />
      </div>

      {/* How It Works Section - no background, centered content */}
      <div className="w-full py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <HomeHowItWorksSection />
        </div>
      </div>

      {/* Events Preview - no background, centered content */}
      <div className="w-full py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <HomeEventsPreview events={events} isLoading={isLoading} />
        </div>
      </div>

      {/* Casual Plans Section - no background, centered content */}
      <div className="w-full py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <HomeCasualPlansSection />
        </div>
      </div>
    </div>
  );
};

export default Home;
