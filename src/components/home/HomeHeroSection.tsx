
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const HomeHeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleExploreEvents = () => {
    navigate('/events');
  };

  const handleCreateProfile = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-secondary-25">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
          Find events and plans that fit your vibe
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-neutral max-w-3xl mx-auto leading-relaxed mb-8">
          Discover what's happening nearby — join events, see who's going, and stay connected after.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={handleExploreEvents}
            size="lg"
            className="bg-primary text-white hover:bg-primary/90 px-8 py-4 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explore Events
          </Button>
          <Button
            onClick={handleCreateProfile}
            variant="outline"
            size="lg"
            className="border-2 border-primary/20 text-primary hover:bg-primary/5 px-8 py-4 text-lg font-medium transition-all duration-300"
          >
            {isAuthenticated ? 'View Profile' : 'Create Profile'}
          </Button>
        </div>

        {/* Visual emoji tags */}
        <div className="flex justify-center items-center gap-6 text-2xl opacity-60">
          <span>🌊</span>
          <span>🧘</span>
          <span>🎶</span>
          <span>🏖️</span>
          <span>🎨</span>
        </div>
      </div>
    </section>
  );
};
