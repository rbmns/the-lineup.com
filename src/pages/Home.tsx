
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { HomeAudienceTiles } from '@/components/home/HomeAudienceTiles';
import { HomeEventsPreview } from '@/components/home/HomeEventsPreview';
import { HomeCasualPlansSection } from '@/components/home/HomeCasualPlansSection';

const Home = () => {
  const { data: events, isLoading } = useEvents(undefined, { includeAllStatuses: true });

  return (
    <div className="w-full bg-warm-neutral min-h-screen">
      {/* Hero Section */}
      <div className="py-16 px-6">
        <HomeHeroSection />
      </div>

      {/* Audience Tiles */}
      <div className="py-12 px-6">
        <HomeAudienceTiles />
      </div>

      {/* Events Preview */}
      <div className="py-12 px-6">
        <HomeEventsPreview events={events} isLoading={isLoading} />
      </div>

      {/* Casual Plans Section */}
      <div className="py-12 px-6">
        <HomeCasualPlansSection />
      </div>
    </div>
  );
};

export default Home;
