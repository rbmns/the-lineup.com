
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Hero image configuration - easy to replace
const HERO_IMAGE = {
  src: "/lovable-uploads/df996738-b355-4d60-acbf-d58c4b42daf0.png",
  alt: "Golden hour beach scene with warm coastal atmosphere",
  // Add fallback image for better reliability
  fallback: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1920&h=1080&fit=crop&auto=format"
};

export const HomeHeroSection = () => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      {/* Hero Background Image with Brand-Aligned Treatment */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full">
          <img
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            className="w-full h-full object-cover object-center sm:object-center-bottom lg:object-center"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width="1920"
            height="1080"
            onError={(e) => {
              // Fallback to placeholder if main image fails
              e.currentTarget.src = HERO_IMAGE.fallback;
            }}
          />
        </div>
        {/* Warm brand-aligned gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-sunset-orange/50 via-sunset-orange/20 to-transparent sm:bg-gradient-to-r sm:from-sunset-orange/40 sm:via-dusk-coral/10 sm:to-transparent" />
        {/* Subtle overlay for optimal text readability */}
        <div className="absolute inset-0 bg-ocean-deep/15" />
      </div>

      {/* Content */}
      <div className={cn(
        "relative z-10 w-full text-center space-y-8 px-4",
        isMobile ? "py-12" : "py-20"
      )}>
        {/* Main Hero Text */}
        <div className="space-y-6">
          <h1 className={cn(
            "font-display font-semibold text-pure-white leading-tight drop-shadow-lg",
            isMobile ? "text-3xl" : "text-5xl lg:text-6xl"
          )}>
            Find events and casual plans that fit your vibe
          </h1>
          
          <p className={cn(
            "text-pure-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow-md",
            isMobile ? "text-lg px-2" : "text-xl"
          )}>
            Discover local plans in Ericeira & Zandvoort — yoga, workshops, beach hangouts & more.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className={cn(
          "flex gap-4 justify-center",
          isMobile ? "flex-col px-4" : "flex-row"
        )}>
          <Button 
            asChild 
            size={isMobile ? "default" : "default"}
            className="bg-sunset-orange hover:bg-dusk-coral text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
          >
            <Link to="/events">
              <Search className="mr-2 h-5 w-5" />
              Explore Events
            </Link>
          </Button>
          
          {!isAuthenticated && (
            <Button
              asChild
              variant="outline"
              size={isMobile ? "default" : "default"}
              className="border-2 border-pure-white text-pure-white hover:bg-pure-white hover:text-ocean-deep font-semibold transition-all duration-200 backdrop-blur-sm px-6 py-3"
            >
              <Link to="/signup">
                <UserPlus className="mr-2 h-5 w-5" />
                Sign Up / Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
