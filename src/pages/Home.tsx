
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { HomeAudienceTiles } from '@/components/home/HomeAudienceTiles';
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

      {/* Audience Tiles - subtle mist grey background */}
      <div className="bg-mist-grey/30 w-full spacing-section spacing-container">
        <HomeAudienceTiles />
      </div>

      {/* Events Preview - clean white background */}
      <div className="bg-pure-white w-full spacing-section spacing-container">
        <HomeEventsPreview events={events} isLoading={isLoading} />
      </div>

      {/* Casual Plans Section - subtle mist grey background */}
      <div className="bg-mist-grey/30 w-full spacing-section spacing-container">
        <HomeCasualPlansSection />
      </div>
    </div>
  );
};

export default Home;
