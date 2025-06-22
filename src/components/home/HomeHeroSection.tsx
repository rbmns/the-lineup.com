
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
      top: window.innerHeight, 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="relative py-20 md:py-32 min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/51db736f-9219-471a-806c-7db86c226fd1.png"
          alt="Beach sunset background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Coral Overlay */}
      <div className="absolute inset-0 z-10 bg-vibrant-coral/20"></div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col justify-center">
        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          Find events and plans that fit your vibe
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8 drop-shadow-md">
          Discover what's happening nearby — join events, see who's going, and stay connected after.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
            className="border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-4 text-lg font-medium transition-all duration-300"
          >
            {isAuthenticated ? 'View Profile' : 'Create Profile'}
          </Button>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <div className="relative z-20 flex justify-center pb-8">
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center text-white/80 hover:text-white transition-colors duration-300 group"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-8 w-8 animate-bounce group-hover:animate-none transition-all duration-300" />
          <span className="text-sm mt-1 opacity-80">Scroll down</span>
        </button>
      </div>
    </section>
  );
};
