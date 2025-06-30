
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const HomeHeroSection = () => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "w-full text-center space-y-8",
      isMobile ? "py-12 px-4" : "py-20 px-8"
    )}>
      {/* Main Hero Text */}
      <div className="space-y-6">
        <h1 className={cn(
          "font-display font-semibold text-ocean-deep leading-tight",
          isMobile ? "text-3xl" : "text-5xl lg:text-6xl"
        )}>
          Find Your Perfect{' '}
          <span className="text-vibrant-aqua">
            Event
          </span>
        </h1>
        
        <p className={cn(
          "text-graphite-grey leading-relaxed max-w-2xl mx-auto",
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
          size={isMobile ? "lg" : "lg"}
          className="btn-primary bg-ocean-teal hover:bg-ocean-teal/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Link to="/events">
            <Search className="mr-2 h-5 w-5" />
            Explore Events
          </Link>
        </Button>
        
        {isAuthenticated && (
          <Button
            asChild
            variant="outline"
            size={isMobile ? "lg" : "lg"}
            className="btn-outline border-2 border-ocean-teal text-ocean-teal hover:bg-ocean-teal hover:text-white font-semibold transition-all duration-200"
          >
            <Link to="/events/create">
              <Plus className="mr-2 h-5 w-5" />
              Create Event
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
