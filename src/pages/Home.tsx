
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { HomeUpcomingEventsSection } from '@/components/home/HomeUpcomingEventsSection';
import HomeHowItWorksSection from '@/components/home/HomeHowItWorksSection';
import { HomeCasualPlansSection } from '@/components/home/HomeCasualPlansSection';
import HomeCtaSection from '@/components/home/HomeCtaSection';

const Home = () => {
  const { data: events, isLoading } = useEvents();

  return (
    <div className="w-full bg-white">
      {/* Upcoming Events Section with Vibe Filters */}
      <HomeUpcomingEventsSection events={events} isLoading={isLoading} />

      {/* How It Works Section */}
      <HomeHowItWorksSection />
      
      {/* Casual Plans Section */}
      <HomeCasualPlansSection />
      
      {/* CTA Section */}
      <HomeCtaSection />
    </div>
  );
};

export default Home;
