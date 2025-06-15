
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
      <div className="w-full gradient-sky m-0 p-0">
        <div className="max-w-4xl mx-auto text-center text-white p-0 m-0">
          <h1 className={`${typography.display} mb-4 text-white mt-0`}>
            Find events that fit your <span className="font-handwritten text-sunset-yellow">vibe</span>
          </h1>
          <p className={`${typography.lead} text-white/90 leading-relaxed max-w-2xl mx-auto mt-0`}>
            Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want.
          </p>
        </div>
      </div>

      {/* Remove all horizontal padding for flush edges */}
      <div className="w-full">
        <div className="space-y-6 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
