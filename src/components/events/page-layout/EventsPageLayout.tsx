
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventsPageLayoutProps {
  children: React.ReactNode;
}

export const EventsPageLayout: React.FC<EventsPageLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header Section - Brand styling with matching background */}
      <div className="relative w-full bg-gradient-to-b from-secondary-25 to-white border-b border-gray-200">
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold tracking-tight text-primary mb-4 leading-tight`}>
              Find events that fit your <span className="text-accent">vibe</span>
            </h1>
            <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-neutral max-w-2xl mx-auto leading-relaxed font-medium`}>
              Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want.
            </p>
            
            {/* Tagline */}
            <div className="mt-4">
              <span className={`${isMobile ? 'text-sm' : 'text-base'} text-neutral-50 font-medium uppercase tracking-wider`}>
                Discover • Connect • Experience
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Brand background */}
      <div className="w-full bg-gradient-to-b from-white to-secondary-25">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  );
};
