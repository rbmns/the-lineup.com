
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { HomeAudienceTiles } from '@/components/home/HomeAudienceTiles';
import { HomeEventsPreview } from '@/components/home/HomeEventsPreview';
import { HomeCasualPlansSection } from '@/components/home/HomeCasualPlansSection';

const Home = () => {
  const { data: events, isLoading } = useEvents(undefined, { includeAllStatuses: true });

  return (
    <div className="w-full bg-sand min-h-screen text-midnight">
      {/* Hero Section - flows naturally on sand */}
      <div className="w-full">
        <HomeHeroSection />
      </div>

      {/* Audience Tiles - subtle ivory background */}
      <div className="bg-ivory/50 w-full px-6 py-16">
        <HomeAudienceTiles />
      </div>

      {/* Events Preview - subtle seafoam background */}
      <div className="bg-seafoam/10 w-full px-6 py-16">
        <HomeEventsPreview events={events} isLoading={isLoading} />
      </div>

      {/* Casual Plans Section - flows naturally on sand */}
      <div className="w-full px-6 py-16">
        <HomeCasualPlansSection />
      </div>
    </div>
  );
};

export default Home;
