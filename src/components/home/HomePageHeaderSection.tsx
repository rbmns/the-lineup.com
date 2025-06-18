
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
            <button className={`bg-black text-white ${isMobile ? 'px-6 py-3 text-base' : 'px-8 py-4 text-lg'} rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg`}>
              Explore Events
            </button>
            <button className={`border-2 border-gray-300 text-black ${isMobile ? 'px-6 py-3 text-base' : 'px-8 py-4 text-lg'} rounded-full font-semibold hover:bg-gray-50 transition-all duration-300`}>
              Create Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageHeaderSection;
