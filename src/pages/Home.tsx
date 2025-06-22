
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { HomeAudienceTiles } from '@/components/home/HomeAudienceTiles';
import { HomeEventsPreview } from '@/components/home/HomeEventsPreview';
import { HomeCasualPlansSection } from '@/components/home/HomeCasualPlansSection';

const Home = () => {
  const { data: events, isLoading } = useEvents(undefined, { includeAllStatuses: true });

  return (
    <div className="w-full bg-gradient-to-b from-secondary-25 to-white min-h-screen">
      {/* Hero Section */}
      <HomeHeroSection />

      {/* Audience Tiles */}
      <HomeAudienceTiles />

      {/* Events Preview */}
      <HomeEventsPreview events={events} isLoading={isLoading} />

      {/* Casual Plans Section */}
      <HomeCasualPlansSection />
    </div>
  );
};

export default Home;
