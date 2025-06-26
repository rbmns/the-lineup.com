
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown } from 'lucide-react';

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

  const handleScrollDown = () => {
    window.scrollTo({ 
      top: window.innerHeight * 0.9, 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden w-full">
      {/* Background Image - Full width */}
      <div className="absolute inset-0 z-0 w-full">
        <img
          src="/lovable-uploads/51db736f-9219-471a-806c-7db86c226fd1.png"
          alt="Beach sunset background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Coral Overlay */}
      <div className="absolute inset-0 z-10 bg-vibrant-coral/20"></div>

      {/* Content - Optimized for mobile viewport */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-12 text-center flex-1 flex flex-col justify-center pt-4 pb-8">
        {/* Main heading - Responsive text sizing */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
          Find events and plans that fit your vibe
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 drop-shadow-md">
          Discover what's happening nearby — join events, see who's going, and stay connected after.
        </p>

        {/* CTA Buttons - Consistent styling */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Button
            onClick={handleExploreEvents}
            size="lg"
            className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl border-0"
          >
            Explore Events
          </Button>
          <Button
            onClick={handleCreateProfile}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium transition-all duration-300"
          >
            {isAuthenticated ? 'View Profile' : 'Create Profile'}
          </Button>
        </div>
      </div>

      {/* Scroll Down Arrow - Only show on larger screens */}
      <div className="relative z-20 hidden sm:flex justify-center pb-6 sm:pb-8">
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center text-white/80 hover:text-white transition-colors duration-300 group"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 animate-bounce group-hover:animate-none transition-all duration-300" />
          <span className="text-xs sm:text-sm mt-1 opacity-80">Scroll down</span>
        </button>
      </div>
    </section>
  );
};
