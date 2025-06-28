
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
      top: window.innerHeight * 0.85, 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden w-full">
      {/* Background Image - Full width with visual treatments */}
      <div className="absolute inset-0 z-0 w-full">
        <img
          src="/lovable-uploads/51db736f-9219-471a-806c-7db86c226fd1.png"
          alt="Beach sunset background"
          className="w-full h-full object-cover"
          style={{
            filter: 'saturate(0.8) brightness(1.1) contrast(1.05)',
          }}
        />
      </div>

      {/* Sand/Coconut Soft Overlay */}
      <div 
        className="absolute inset-0 z-10" 
        style={{
          backgroundColor: 'rgba(248, 245, 240, 0.35)' // Sand color at 35% opacity
        }}
      ></div>

      {/* Warm Sunset Tint Overlay */}
      <div 
        className="absolute inset-0 z-15" 
        style={{
          backgroundColor: 'rgba(255, 158, 0, 0.12)', // Sunset yellow at 12% opacity
          mixBlendMode: 'overlay'
        }}
      ></div>

      {/* Content - Optimized for mobile viewport and above-the-fold */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-12 text-center flex-1 flex flex-col justify-center py-16 sm:py-20 md:py-24">
        {/* Main heading - Responsive text sizing optimized for mobile */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-midnight mb-3 sm:mb-4 md:mb-6 leading-tight drop-shadow-lg max-w-4xl mx-auto">
          Find events and plans that fit your vibe
        </h1>

        {/* Subtitle - optimized for mobile readability */}
        <p className="text-base sm:text-lg md:text-xl text-ocean-deep max-w-xl lg:max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 drop-shadow-md px-2">
          Discover what's happening nearby — join events, see who's going, and stay connected after.
        </p>

        {/* CTA Buttons - Mobile-first responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-sm sm:max-w-none mx-auto">
          <Button
            onClick={handleExploreEvents}
            size="lg"
            className="w-full sm:w-auto bg-ocean-deep text-coconut hover:bg-ocean-deep/90 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl border-0 rounded-md"
          >
            Explore Events
          </Button>
          <Button
            onClick={handleCreateProfile}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-2 border-ocean-deep/50 text-ocean-deep bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium transition-all duration-300 rounded-md"
          >
            {isAuthenticated ? 'View Profile' : 'Create Profile'}
          </Button>
        </div>
      </div>

      {/* Scroll Down Arrow - Only show on larger screens */}
      <div className="relative z-20 hidden sm:flex justify-center pb-6 sm:pb-8">
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center text-ocean-deep/80 hover:text-ocean-deep transition-colors duration-300 group"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 animate-bounce group-hover:animate-none transition-all duration-300" />
          <span className="text-sm mt-2 opacity-80">Scroll down</span>
        </button>
      </div>
    </section>
  );
};
