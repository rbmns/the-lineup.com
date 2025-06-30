
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const HomeHeroSection = () => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/ac438e1f-f8a7-4208-aeed-6c95081daf90.png"
          alt="Beach sunset background"
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/60 via-ocean-deep/30 to-transparent" />
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
            discover local events and casual plans that fit your vibe
          </h1>
          
          <p className={cn(
            "text-pure-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow-md",
            isMobile ? "text-lg px-2" : "text-xl"
          )}>
            Discover unique experiences, connect with like-minded people, and make memories that last a lifetime.
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
            className="bg-ocean-teal hover:bg-ocean-teal/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
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
