
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

interface EventsPageLayoutProps {
  children: React.ReactNode;
}

export const EventsPageLayout: React.FC<EventsPageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHeader 
        title="Find events and plans that fit your vibe"
        subtitle="Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want."
      />

      {/* Main Content */}
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="space-y-6 md:space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};
