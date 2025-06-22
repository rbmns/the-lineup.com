
import React from 'react';
import { EventsPageContent } from '@/components/events/EventsPageContent';

const Events = () => {
  return (
    <div className="w-full bg-gradient-to-b from-secondary-25 to-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-secondary-25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Find events that fit your <span className="text-vibrant-seafoam">vibe</span>
          </h1>
          <p className="text-xl text-neutral max-w-3xl mx-auto leading-relaxed mb-8">
            Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want.
          </p>
          <div className="flex justify-center items-center gap-6 text-2xl opacity-60">
            <span>🌊</span>
            <span>🧘</span>
            <span>🎶</span>
            <span>🏖️</span>
            <span>🎨</span>
          </div>
        </div>
      </section>

      {/* Events Content */}
      <div className="bg-white">
        <EventsPageContent />
      </div>
    </div>
  );
};

export default Events;
