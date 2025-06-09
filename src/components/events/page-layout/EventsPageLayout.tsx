
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

      {/* Main Content - Minimal padding, let content breathe to edges */}
      <div className="w-full px-4 sm:px-6 md:px-8">
        <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
