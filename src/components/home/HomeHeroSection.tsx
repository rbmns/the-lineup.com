
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
      {/* Background Image - Your uploaded beach sunset image with treatment */}
      <div className="absolute inset-0 z-0 w-full lineup-image-style">
        <img 
          src="/lovable-uploads/411b28c8-c83f-4be2-8257-72901bf0fbaf.png" 
          alt="Beach sunset with waves" 
          className="w-full h-full object-cover img-cinematic" 
        />
      </div>

      {/* Content - Text and buttons directly on the image */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-12 text-center flex-1 flex flex-col justify-center py-16 sm:py-20 md:py-24">
        {/* Main heading with elegant contrast */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-pure-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
            Find events and plans that fit your vibe
          </h1>

          {/* Subtitle with subtle background for readability */}
          <div className="inline-block bg-pure-white/10 backdrop-blur-sm rounded-lg px-6 py-3 mb-8 sm:mb-10">
            <p className="text-lg sm:text-xl md:text-2xl text-pure-white/95 max-w-xl lg:max-w-2xl mx-auto leading-relaxed font-lato">
              Discover what's happening nearby — join events, see who's going, and stay connected after.
            </p>
          </div>

          {/* CTA Buttons - Using design system classes */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-sm sm:max-w-none mx-auto">
            <Button 
              onClick={handleExploreEvents} 
              size="lg" 
              className="btn-primary w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Events
            </Button>
            <Button 
              onClick={handleCreateProfile} 
              variant="secondary" 
              size="lg" 
              className="w-full sm:w-auto bg-pure-white/20 backdrop-blur-sm border-2 border-pure-white/50 text-pure-white hover:bg-pure-white hover:text-graphite-grey px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              {isAuthenticated ? 'View Profile' : 'Create Profile'}
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Down Arrow - Only show on larger screens */}
      <div className="relative z-20 hidden sm:flex justify-center pb-6 sm:pb-8">
        <button 
          onClick={handleScrollDown} 
          className="flex flex-col items-center text-pure-white/90 hover:text-sunrise-ochre transition-colors duration-300 group bg-pure-white/10 backdrop-blur-sm rounded-full p-4 border border-pure-white/20" 
          aria-label="Scroll down"
        >
          <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 animate-bounce group-hover:animate-none transition-all duration-300" />
          <span className="text-sm mt-2 opacity-80 font-lato">Scroll down</span>
        </button>
      </div>
    </section>
  );
};
