
import React from "react";
import { typography } from "@/components/polymet/brand-typography";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Home page hero section with proper styling and gradients
 */
const HomePageHeaderSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative w-full min-h-[450px] md:min-h-[600px] overflow-hidden bg-gradient-to-br from-[#005F73] via-[#2A9D8F] to-[#00B4DB]">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm10 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[450px] md:min-h-[600px] text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main headline */}
          <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl lg:text-7xl'} font-bold tracking-tight text-white mb-6 leading-tight`}>
            Find events that fit your{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#EDC46A] font-bold">vibe</span>
              <div className="absolute bottom-2 left-0 w-full h-3 bg-[#EDC46A]/30 rounded-full transform -rotate-1"></div>
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} text-white/90 max-w-3xl mx-auto leading-relaxed mb-8 font-medium`}>
            Discover what's happening nearby — from beach parties to chill yoga sessions.
            Join when you want, connect if you want.
          </p>

          {/* Tagline */}
          <div className="mb-8">
            <span className={`${isMobile ? 'text-base' : 'text-lg'} text-[#EDC46A] font-semibold uppercase tracking-wider`}>
              Join the Flow
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-[#005F73] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#F4E7D3] transition-all duration-300 transform hover:scale-105 shadow-lg">
              Explore Events
            </button>
            <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              Create Plans
            </button>
          </div>
        </div>
      </div>

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default HomePageHeaderSection;
