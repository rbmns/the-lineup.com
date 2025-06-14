
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEventImages } from '@/hooks/useEventImages';
import { Event } from '@/types';
import { CasualPlansHomeSection } from '@/components/home/CasualPlansHomeSection';
import { UpcomingEventsSection } from '@/components/home/UpcomingEventsSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { LandingCtaSection } from '@/components/home/LandingCtaSection';

const LandingPage = () => {
  const {
    isAuthenticated
  } = useAuth();
  const {
    data: events,
    isLoading
  } = useEvents();
  const isMobile = useIsMobile();
  const {
    getEventImageUrl
  } = useEventImages();
  const navigate = useNavigate();
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    if (window.location.pathname === '/' && document.referrer && !document.referrer.includes(window.location.origin + '/')) {
      scrollToTop();
    }
  }, []);

  const upcomingEvents = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const nextWeekEvents = events.filter(event => {
      if (!event.start_date) return false;
      const eventDate = new Date(event.start_date);
      return eventDate <= oneWeekFromNow;
    });
    const eventsByType = nextWeekEvents.reduce((acc, event) => {
      if (!event.event_category) return acc;
      if (!acc[event.event_category]) acc[event.event_category] = [];
      acc[event.event_category].push(event);
      return acc;
    }, {} as Record<string, typeof events>);
    const featured = Object.values(eventsByType).map(typeEvents => typeEvents[0]);
    if (featured.length < 5 && nextWeekEvents.length > 0) {
      const moreEvents = nextWeekEvents.filter(event => !featured.some(f => f.id === event.id)).slice(0, 5 - featured.length);
      return [...featured, ...moreEvents];
    }
    return featured;
  }, [events]);

  const availableVibes = React.useMemo(() => {
    if (!upcomingEvents || upcomingEvents.length === 0) return [];
    const vibes = new Set<string>();
    upcomingEvents.forEach(event => {
      if (event.vibe) {
        vibes.add(event.vibe);
      }
    });
    return Array.from(vibes).sort();
  }, [upcomingEvents]);

  const filteredEvents = React.useMemo(() => {
    if (!selectedVibe) return upcomingEvents;
    return upcomingEvents.filter(event => event.vibe === selectedVibe);
  }, [upcomingEvents, selectedVibe]);

  const handleVibeClick = (vibe: string) => {
    setSelectedVibe(prevVibe => prevVibe === vibe ? null : vibe);
  };

  const handleEventClick = useCallback((event: Event) => {
    if (event.id) {
      navigate(`/events/${event.id}`);
    }
  }, [navigate]);

  return <div className="w-full px-[20px] py-[20px]">
      {/* HEADER HERO */}
      <section className="w-full border-b pt-0 mt-0 bg-transparent">
        {/* FLUSH, NO HORIZONTAL PADDING */}
        <div className="w-full text-left pt-0 mt-0 py-[20px]">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 mt-0 px-4 md:px-8">
            Find events that fit your <span className="font-handwritten text-primary">vibe</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mt-0 px-4 md:px-8">
            Discover what's happening nearby — from beach parties to yoga, music, and more. Join when you want, connect if you want.
          </p>
        </div>
      </section>

      <UpcomingEventsSection
        isLoading={isLoading}
        filteredEvents={filteredEvents}
        availableVibes={availableVibes}
        selectedVibe={selectedVibe}
        handleVibeClick={handleVibeClick}
        setSelectedVibe={setSelectedVibe}
        getEventImageUrl={getEventImageUrl}
        handleEventClick={handleEventClick}
      />

      <HowItWorksSection />
      <CasualPlansHomeSection />
      <LandingCtaSection />
    </div>;
};
export default LandingPage;
