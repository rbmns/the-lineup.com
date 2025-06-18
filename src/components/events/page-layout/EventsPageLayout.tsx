
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

interface EventsPageLayoutProps {
  children: React.ReactNode;
}

export const EventsPageLayout: React.FC<EventsPageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section - Full width with coastal gradient */}
      <div className="w-full gradient-sky m-0 p-0">
        <div className="w-full text-center text-white p-0 m-0">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white mt-0 px-4 md:px-8">
            Find events that fit your <span className="font-handwritten text-sunset-yellow">vibe</span>
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mt-0 px-4 md:px-8">
            Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want.
          </p>
        </div>
      </div>
      {/* FULL-WIDTH, CHILDREN CAN HANDLE OWN RESTRICTION */}
      <div className="w-full">
        <div className="space-y-6 w-full">{children}</div>
      </div>
    </div>
  );
};
