
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { HomeAudienceTiles } from '@/components/home/HomeAudienceTiles';
import { HomeEventsPreview } from '@/components/home/HomeEventsPreview';
import { HomeCasualPlansSection } from '@/components/home/HomeCasualPlansSection';

const Home = () => {
  const { data: events, isLoading } = useEvents(undefined, { includeAllStatuses: true });

  return (
    <div className="w-full bg-sand min-h-screen">
      {/* Hero Section */}
      <div className="px-6 py-12">
        <HomeHeroSection />
      </div>

      {/* Audience Tiles - Sage background */}
      <div className="bg-sage px-6 py-12">
        <HomeAudienceTiles />
      </div>

      {/* Events Preview - Ivory background */}
      <div className="bg-ivory px-6 py-12">
        <HomeEventsPreview events={events} isLoading={isLoading} />
      </div>

      {/* Casual Plans Section */}
      <div className="px-6 py-12">
        <HomeCasualPlansSection />
      </div>
    </div>
  );
};

export default Home;
