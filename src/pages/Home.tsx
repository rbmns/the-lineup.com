
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import HomeHowItWorksSection from '@/components/home/HomeHowItWorksSection';
import { HomeEventsPreview } from '@/components/home/HomeEventsPreview';
import { HomeCasualPlansSection } from '@/components/home/HomeCasualPlansSection';

const Home = () => {
  const { data: events, isLoading } = useEvents(undefined, { includeAllStatuses: true });

  return (
    <div className="w-full bg-brand-card min-h-screen text-brand-foreground">
      {/* Hero Section - flows naturally */}
      <div className="w-full">
        <HomeHeroSection />
      </div>

      {/* How It Works Section */}
      <div className="w-full">
        <HomeHowItWorksSection />
      </div>

      {/* Events Preview - clean background */}
      <div className="bg-brand-card w-full section-spacing page-container">
        <HomeEventsPreview events={events} isLoading={isLoading} />
      </div>

      {/* Casual Plans Section - subtle muted background */}
      <div className="bg-brand-muted w-full section-spacing page-container">
        <HomeCasualPlansSection />
      </div>
    </div>
  );
};

export default Home;
