
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

      {/* Main Content - Reduced padding */}
      <div className="px-2 md:px-4 py-4 md:py-6">
        <div className="space-y-4 md:space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};
