
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import HomePageHeaderSection from '@/components/home/HomePageHeaderSection';
import { HomeUpcomingEventsSection } from '@/components/home/HomeUpcomingEventsSection';
import HomeHowItWorksSection from '@/components/home/HomeHowItWorksSection';
import { HomeCasualPlansSection } from '@/components/home/HomeCasualPlansSection';
import HomeCtaSection from '@/components/home/HomeCtaSection';

const Home = () => {
  const { data: events, isLoading } = useEvents();

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <HomePageHeaderSection />
      
      {/* Upcoming Events Section */}
      <HomeUpcomingEventsSection events={events} isLoading={isLoading} />

      {/* How It Works Section */}
      <HomeHowItWorksSection />
      
      {/* Casual Plans Section */}
      <div className="bg-[#F4E7D3]/20">
        <HomeCasualPlansSection />
      </div>
      
      {/* CTA Section */}
      <HomeCtaSection />
    </div>
  );
};

export default Home;
