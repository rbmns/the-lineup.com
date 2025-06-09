
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

interface EventsPageLayoutProps {
  children: React.ReactNode;
}

export const EventsPageLayout: React.FC<EventsPageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full width */}
      <PageHeader 
        title="Find events and plans that fit your vibe"
        subtitle="Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want."
      />

      {/* Main Content - Reduced padding on mobile */}
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
