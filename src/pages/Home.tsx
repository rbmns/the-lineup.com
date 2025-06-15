
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, Search, Map, ChevronLeft, ChevronRight, Edit, UserCircle, Sparkles, Coffee, MapPin, Clock, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { EventCategoryIcon } from '@/components/ui/event-category-icon';
import { useEvents } from '@/hooks/useEvents';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEventImages } from '@/hooks/useEventImages';
import { CategoryPill } from '@/components/ui/category-pill';
import { getCategoryColorState } from '@/components/ui/category/category-color-mapping';
import { Event } from '@/types';
import { useEventCategories } from '@/hooks/home/useEventCategories';
import { formatFeaturedDate, formatEventTime } from '@/utils/date-formatting';
import { CasualPlansHomeSection } from '@/components/home/CasualPlansHomeSection';
import { LineupImage } from '@/components/ui/lineup-image';
import { Helmet } from 'react-helmet-async';
import PolymetEventCard from '@/components/polymet/event-card';
import { HomeUpcomingEventsSection } from "@/components/home/HomeUpcomingEventsSection";
import HomePageHeaderSection from '@/components/home/HomePageHeaderSection';
import HomeHowItWorksSection from '@/components/home/HomeHowItWorksSection';
import HomeCtaSection from '@/components/home/HomeCtaSection';
import { startOfDay } from 'date-fns';

const Home = () => {
  const {
    isAuthenticated
  } = useAuth();
  const {
    data: events,
    isLoading
  } = useEvents();
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const {
    getEventImageUrl
  } = useEventImages();
  const navigate = useNavigate();
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  // Scroll to top when coming from another page (but not on initial load)
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    // Only scroll to top if we're navigating from another page
    if (window.location.pathname === '/' && document.referrer && !document.referrer.includes(window.location.origin + '/')) {
      scrollToTop();
    }
  }, []);

  // Get upcoming events for the next week
  const upcomingEvents = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const today = startOfDay(new Date());

    // Get events for the next week
    const nextWeekEvents = events.filter(event => {
      if (!event.start_date) return false;
      const eventDate = new Date(event.start_date);
      return eventDate >= today && eventDate <= oneWeekFromNow;
    });

    // Group by event category to ensure diversity
    const eventsByType = nextWeekEvents.reduce((acc, event) => {
      if (!event.event_category) return acc;
      if (!acc[event.event_category]) acc[event.event_category] = [];
      acc[event.event_category].push(event);
      return acc;
    }, {} as Record<string, typeof events>);

    // Get one event from each type
    const featured = Object.values(eventsByType).map(typeEvents => typeEvents[0]);

    // If we don't have at least 5 events, add more from any category
    if (featured.length < 5 && nextWeekEvents.length > 0) {
      const moreEvents = nextWeekEvents.filter(event => !featured.some(f => f.id === event.id)).slice(0, 5 - featured.length);
      return [...featured, ...moreEvents];
    }
    return featured;
  }, [events]);

  // Get available vibes from upcoming events
  const availableVibes = React.useMemo(() => {
    if (!upcomingEvents || upcomingEvents.length === 0) return [];
    const vibes = new Set<string>();
    upcomingEvents.forEach(event => {
      if (event.tags && Array.isArray(event.tags)) {
        event.tags.forEach(tag => vibes.add(tag));
      }
    });
    return Array.from(vibes).sort();
  }, [upcomingEvents]);

  // Filter events by selected vibe
  const filteredEvents = React.useMemo(() => {
    if (!selectedVibe) return upcomingEvents;
    return upcomingEvents.filter(event => event.tags && Array.isArray(event.tags) && event.tags.includes(selectedVibe));
  }, [upcomingEvents, selectedVibe]);
  const handleVibeClick = (vibe: string) => {
    setSelectedVibe(prevVibe => prevVibe === vibe ? null : vibe);
  };
  const scrollEvents = (direction: 'left' | 'right') => {
    if (!eventsContainerRef.current) return;
    const container = eventsContainerRef.current;
    const scrollAmount = container.clientWidth * (direction === 'left' ? -0.8 : 0.8);
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };
  const handleEventClick = useCallback((event: Event) => {
    if (event.id) {
      navigate(`/events/${event.id}`);
    }
  }, [navigate]);
  return (
    <div className="w-full min-h-screen">
      <Helmet>
        <title>the lineup</title>
        <meta name="description" content="Discover and join events in your area" />
      </Helmet>

      {/* Wide modern header */}
      <HomePageHeaderSection />

      {/* Upcoming Events Section */}
      <HomeUpcomingEventsSection
        isLoading={isLoading}
        filteredEvents={filteredEvents}
        handleEventClick={handleEventClick}
        availableVibes={availableVibes}
        selectedVibe={selectedVibe}
        setSelectedVibe={setSelectedVibe}
        getEventImageUrl={getEventImageUrl}
      />

      {/* Standardized How It Works Section */}
      <HomeHowItWorksSection />

      {/* Casual Plans Feature Section */}
      <CasualPlansHomeSection />

      {/* Standardized CTA Section */}
      <HomeCtaSection />
    </div>
  );
};

export default Home;
