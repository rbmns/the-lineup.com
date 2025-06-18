
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/**
 * Home page hero section with clean white styling
 */
const HomePageHeaderSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative w-full bg-white">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Main headline */}
          <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-bold tracking-tight text-black mb-6 leading-tight`}>
            What's happening now
          </h1>

          {/* Subtitle */}
          <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-black max-w-3xl mx-auto leading-relaxed mb-8`}>
            Discover events that match your energy — from sunrise yoga to sunset gatherings
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              asChild
              size={isMobile ? "default" : "lg"}
              className={`${isMobile ? 'px-6 py-3 text-base' : 'px-8 py-4 text-lg'} font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg`}
            >
              <Link to="/events">
                Explore Events
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size={isMobile ? "default" : "lg"}
              className={`${isMobile ? 'px-6 py-3 text-base' : 'px-8 py-4 text-lg'} font-semibold transition-all duration-300`}
            >
              <Link to="/casual-plans/create">
                Create Plans
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageHeaderSection;
