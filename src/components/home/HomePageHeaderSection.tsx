
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Home page hero section with clean white styling
 */
const HomePageHeaderSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative w-full bg-white border-b border-gray-200">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Main headline */}
          <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl lg:text-7xl'} font-bold tracking-tight text-gray-900 mb-6 leading-tight`}>
            Find events that fit your{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-blue-600 font-bold">vibe</span>
              <div className="absolute bottom-2 left-0 w-full h-3 bg-blue-100 rounded-full transform -rotate-1"></div>
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 font-medium`}>
            Discover what's happening nearby — from beach parties to chill yoga sessions.
            Join when you want, connect if you want.
          </p>

          {/* Tagline */}
          <div className="mb-8">
            <span className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-500 font-semibold uppercase tracking-wider`}>
              Join the Flow
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Explore Events
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300">
              Create Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageHeaderSection;
