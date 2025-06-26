
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
      {/* Hero Section - Full Width */}
      <div className="w-full">
        <HomeHeroSection />
      </div>

      {/* Audience Tiles - Sage background with controlled padding */}
      <div className="bg-sage w-full px-4 sm:px-6 lg:px-12 py-12">
        <HomeAudienceTiles />
      </div>

      {/* Events Preview - Ivory background with controlled padding */}
      <div className="bg-ivory w-full px-4 sm:px-6 lg:px-12 py-12">
        <HomeEventsPreview events={events} isLoading={isLoading} />
      </div>

      {/* Casual Plans Section - Controlled padding */}
      <div className="w-full px-4 sm:px-6 lg:px-12 py-12">
        <HomeCasualPlansSection />
      </div>
    </div>
  );
};

export default Home;
