
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

  const handleSignUp = () => {
    if (isAuthenticated) {
      navigate('/events');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50/30 to-teal-50/40 py-20 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
          Find events and plans that fit your vibe
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Discover what's happening nearby — join events, see who's going, and stay in touch after.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleExploreEvents}
            size="lg"
            className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Explore Events
          </Button>
          <Button
            onClick={handleSignUp}
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 text-gray-900 hover:bg-gray-50 px-8 py-4 text-lg rounded-full font-semibold transition-all duration-300"
          >
            {isAuthenticated ? 'Browse Events' : 'Sign Up'}
          </Button>
        </div>
      </div>
    </section>
  );
};
