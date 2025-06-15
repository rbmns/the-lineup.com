
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { typography } from '@/components/polymet/brand-typography';

interface EventsPageLayoutProps {
  children: React.ReactNode;
}

export const EventsPageLayout: React.FC<EventsPageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full width with coastal gradient */}
      <div className="w-full gradient-sky py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className={`${typography.display} mb-4 text-white`}>
            Find events that fit your <span className="font-handwritten text-sunset-yellow">vibe</span>
          </h1>
          <p className={`${typography.lead} text-white/90 leading-relaxed max-w-2xl mx-auto`}>
            Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want.
          </p>
        </div>
      </div>

      {/* Main Content - Optimized spacing */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="space-y-6 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
