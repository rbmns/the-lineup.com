
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

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { data: events, isLoading } = useEvents();
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { getEventImageUrl } = useEventImages();
  const navigate = useNavigate();
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  
  // Scroll to top when coming from another page (but not on initial load)
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // Only scroll to top if we're navigating from another page
    if (window.location.pathname === '/' && document.referrer && 
        !document.referrer.includes(window.location.origin + '/')) {
      scrollToTop();
    }
  }, []);

  // Get upcoming events for the next week
  const upcomingEvents = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    // Get events for the next week
    const nextWeekEvents = events.filter(event => {
      if (!event.start_date) return false;
      const eventDate = new Date(event.start_date);
      return eventDate <= oneWeekFromNow;
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
      const moreEvents = nextWeekEvents
        .filter(event => !featured.some(f => f.id === event.id))
        .slice(0, 5 - featured.length);
      
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
    return upcomingEvents.filter(event => 
      event.tags && Array.isArray(event.tags) && event.tags.includes(selectedVibe)
    );
  }, [upcomingEvents, selectedVibe]);

  const handleVibeClick = (vibe: string) => {
    setSelectedVibe(prevVibe => prevVibe === vibe ? null : vibe);
  };

  const scrollEvents = (direction: 'left' | 'right') => {
    if (!eventsContainerRef.current) return;
    
    const container = eventsContainerRef.current;
    const scrollAmount = container.clientWidth * (direction === 'left' ? -0.8 : 0.8);
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleEventClick = useCallback((event: Event) => {
    if (event.id) {
      navigate(`/events/${event.id}`);
    }
  }, [navigate]);

  return (
    <div className="w-full bg-gray-50">
      <Helmet>
        <title>the lineup</title>
        <meta name="description" content="Discover and join events in your area" />
      </Helmet>
      
      {/* Hero Section with Updated Background - Fixed height for desktop */}
      <section className="relative bg-cover bg-center w-full" style={{
        backgroundImage: "url('/lovable-uploads/68eaf77e-c1bd-4326-bfdc-72328318f27d.png')",
        height: isMobile ? '80vh' : '600px' // Fixed height for desktop, responsive for mobile
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative w-full px-4 text-center text-white h-full flex items-center">
          <div className="max-w-4xl mx-auto">
            <h1 className={`font-bold tracking-tight mb-4 ${
              isMobile ? 'text-3xl' : 'text-5xl md:text-6xl'
            }`}>
              See what's on in Zandvoort
            </h1>
            <p className={`leading-relaxed mb-6 ${
              isMobile ? 'text-base' : 'text-xl'
            }`}>
              Discover local events and casual plans that fit your vibe. Explore what's happening nearby - music, surf, art, community, and more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline" size={isMobile ? "default" : "lg"} className="border-2 bg-transparent border-white text-white hover:bg-white/10">
                <Link to="/events">
                  Explore Events
                </Link>
              </Button>
              <Button asChild variant="outline" size={isMobile ? "default" : "lg"} className="border-2 bg-transparent border-white text-white hover:bg-white/10">
                <Link to="/profile">
                  Create Your Free Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator arrow - only on mobile */}
        {isMobile && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-6 w-6 text-white/80" />
          </div>
        )}
      </section>

      {/* Upcoming Events Section */}
      <section className="py-8 bg-gray-50 w-full">
        <div className="w-full px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold tracking-tight">Upcoming Events</h2>
              <Link to="/events" className="text-blue-600 hover:text-blue-800 font-medium">
                View all →
              </Link>
            </div>
            
            {/* Vibe Filter Pills - single row, grow wider */}
            {availableVibes.length > 0 && (
              <div className="mb-8">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button
                    onClick={() => setSelectedVibe(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                      !selectedVibe 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    All vibes
                  </button>
                  {availableVibes.map((vibe) => (
                    <button
                      key={vibe}
                      onClick={() => handleVibeClick(vibe)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                        selectedVibe === vibe 
                          ? 'bg-black text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Events Grid with consistent heights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="flex justify-center w-full py-8 col-span-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-black"></div>
                </div>
              ) : filteredEvents.length > 0 ? (
                filteredEvents.slice(0, 3).map((event) => (
                  <div 
                    key={event.id}
                    className="cursor-pointer h-full" // Ensure consistent heights
                    onClick={() => handleEventClick(event)}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                      <div className="relative">
                        <LineupImage
                          src={event.image_urls && event.image_urls.length > 0 ? event.image_urls[0] : getEventImageUrl(event)}
                          alt={event.title}
                          aspectRatio="video"
                          overlayVariant="ocean"
                          className="h-48"
                        />
                        {event.event_category && (
                          <div className="absolute top-3 left-3 z-30">
                            <CategoryPill 
                              category={event.event_category} 
                              active={true}
                              noBorder={true}
                            />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold mb-2 line-clamp-2">{event.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {formatFeaturedDate(event.start_date)} • {formatEventTime(event.start_time, event.end_time)}
                        </p>
                        <p className="text-sm text-gray-600 flex-1">{event.venues?.name || event.location}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No events available
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How The Lineup Works Section */}
      <section className="py-16 bg-white w-full">
        <div className="w-full px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight mb-4">How The Lineup Works</h2>
              <p className="text-lg text-gray-600">
                Discover, connect, and experience amazing events in your area with just a few taps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Discover Events</h3>
                <p className="text-gray-600">
                  Browse events happening near you, from yoga sessions to beach parties and everything in between.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">RSVP & Plan</h3>
                <p className="text-gray-600">
                  Show interest or commit to going. Keep track of your plans and never miss out on what matters to you.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect & Enjoy</h3>
                <p className="text-gray-600">
                  Meet like-minded people at events and build meaningful connections in your community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casual Plans Feature Section */}
      <CasualPlansHomeSection />

      {/* CTA Section */}
      <section className="py-16 bg-white w-full">
        <div className="w-full px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Ready to Find Your Next Adventure?</h2>
            <p className="text-xl mb-8">
              Join our community and start discovering events that match your interests and vibe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="default" size="lg">
                <Link to="/events">
                  Explore Events
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/profile">
                  Create Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
