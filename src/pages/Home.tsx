
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import HomeHowItWorksSection from '@/components/home/HomeHowItWorksSection';
import { HomeEventsPreview } from '@/components/home/HomeEventsPreview';
import { HomeCasualPlansSection } from '@/components/home/HomeCasualPlansSection';

const Home = () => {
  const { data: events, isLoading } = useEvents(undefined, { includeAllStatuses: true });

  return (
    <div className="w-full bg-coconut min-h-screen text-graphite-grey">
      {/* Hero Section - flows naturally */}
      <div className="w-full">
        <HomeHeroSection />
      </div>

      {/* How It Works Section */}
      <div className="w-full">
        <HomeHowItWorksSection />
      </div>

      {/* Events Preview - clean coconut background */}
      <div className="bg-coconut w-full spacing-section spacing-container">
        <HomeEventsPreview events={events} isLoading={isLoading} />
      </div>

      {/* Casual Plans Section - subtle sand pink background */}
      <div className="bg-sand-pink w-full spacing-section spacing-container">
        <HomeCasualPlansSection />
      </div>
    </div>
  );
};

export default Home;
