
import React from 'react';
import HeroSection from '@/components/polymet/hero-section';
import HowItWorksSection from '@/components/polymet/how-it-works-section';

const LandingPage = () => {
  return (
    <div className="w-full">
      <HeroSection
        title="Discover & Join Local Events"
        description="Your one-stop platform to find exciting events, connect with people, and create memorable experiences."
        buttonText="Explore Events"
        buttonLink="/events"
      />
      <HowItWorksSection />
    </div>
  );
};

export default LandingPage;
