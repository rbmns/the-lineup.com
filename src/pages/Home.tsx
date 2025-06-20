
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { WhoIsItForSection } from '@/components/home/WhoIsItForSection';
import { HomeUpcomingEventsSection } from '@/components/home/HomeUpcomingEventsSection';
import HomeHowItWorksSection from '@/components/home/HomeHowItWorksSection';
import { HomeCasualPlansSection } from '@/components/home/HomeCasualPlansSection';
import { HomeCategoriesSection } from '@/components/home/HomeCategoriesSection';
import { OrganizerCtaSection } from '@/components/home/OrganizerCtaSection';
import HomeCtaSection from '@/components/home/HomeCtaSection';

const Home = () => {
  // For the home page, we want to show published events only
  const { data: events, isLoading } = useEvents(undefined, { includeAllStatuses: false });

  return (
    <div className="w-full bg-white">
      {/* Homepage Hero Section */}
      <HomeHeroSection />

      {/* Who's it for Section */}
      <WhoIsItForSection />

      {/* Upcoming Events Section with Vibe Filters */}
      <HomeUpcomingEventsSection events={events} isLoading={isLoading} />

      {/* Categories Section */}
      <HomeCategoriesSection events={events} />

      {/* How It Works Section */}
      <HomeHowItWorksSection />
      
      {/* Casual Plans Section */}
      <HomeCasualPlansSection />
      
      {/* Organizer CTA Section */}
      <OrganizerCtaSection />
      
      {/* CTA Section */}
      <HomeCtaSection />
    </div>
  );
};

export default Home;
