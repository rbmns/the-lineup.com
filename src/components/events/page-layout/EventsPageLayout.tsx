import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
interface EventsPageLayoutProps {
  children: React.ReactNode;
}
export const EventsPageLayout: React.FC<EventsPageLayoutProps> = ({
  children
}) => {
  const isMobile = useIsMobile();
  return <div className="min-h-screen w-full bg-gradient-to-b from-secondary-25 to-white">
      {/* Hero Section - Much larger like casual plans page */}
      <section className="py-24 lg:py-48 bg-gradient-to-b from-secondary-25 to-white md:py-[100px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl lg:text-7xl'} font-bold text-primary mb-8 leading-tight`}>
            Find events that fit your <span className="text-accent">vibe</span>
          </h1>
          <p className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} text-neutral max-w-3xl mx-auto leading-relaxed mb-12`}>
            Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want.
          </p>
          
          {/* Tagline with emojis - larger spacing */}
          <div className="flex justify-center items-center gap-8 text-3xl md:text-4xl opacity-60">
            <span>🏄</span>
            <span>🎵</span>
            <span>🌅</span>
            <span>🍻</span>
            <span>🧘</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </div>
      </div>
    </div>;
};