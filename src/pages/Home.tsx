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
    <div className="w-full min-h-screen">
      <Helmet>
        <title>the lineup</title>
        <meta name="description" content="Discover and join events in your area" />
      </Helmet>

      {/* Simple Page Header */}
      <section className="w-full border-b bg-white pt-10 pb-8 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-left">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ocean-deep mb-2">
            Find events that fit your <span className="text-handwritten text-sunset-yellow">vibe</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Discover what's happening nearby — from beach parties to yoga, music, and more. Join when you want, connect if you want.
          </p>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-12 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-ocean-deep mb-2">Upcoming Events</h2>
                <p className="text-clay-earth">Discover what's happening in your area</p>
              </div>
              <Link 
                to="/events" 
                className="text-seafoam-green hover:text-ocean-deep font-medium transition-colors"
              >
                View all →
              </Link>
            </div>
            
            {/* Vibe Filter Pills */}
            {availableVibes.length > 0 && (
              <div className="mb-8">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  <button
                    onClick={() => setSelectedVibe(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      !selectedVibe 
                        ? 'btn-ocean text-white shadow-md' 
                        : 'bg-white/80 text-clay-earth hover:bg-white border border-driftwood-grey'
                    }`}
                  >
                    All vibes
                  </button>
                  {availableVibes.map((vibe) => (
                    <button
                      key={vibe}
                      onClick={() => handleVibeClick(vibe)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                        selectedVibe === vibe 
                          ? 'btn-sunset text-white shadow-md' 
                          : 'bg-white/80 text-clay-earth hover:bg-white border border-driftwood-grey'
                      }`}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Events Grid - ONLY Polymet Card, SLIGHTLY rounded corners */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card-coastal animate-pulse">
                    <div className="h-48 bg-driftwood-grey/30"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-driftwood-grey/30 w-3/4"></div>
                      <div className="h-3 bg-driftwood-grey/30 w-1/2"></div>
                      <div className="h-3 bg-driftwood-grey/30 w-2/3"></div>
                    </div>
                  </div>
                ))
              ) : filteredEvents.length > 0 ? (
                filteredEvents.slice(0, 3).map((event) => (
                  <div 
                    key={event.id}
                    className="cursor-pointer h-full transform hover:scale-105 transition-all duration-300" 
                    onClick={() => handleEventClick(event)}
                  >
                    <PolymetEventCard
                      id={event.id}
                      title={event.title}
                      image={event.image_urls?.[0] || "/img/default.jpg"}
                      category={event.event_category || "Other"}
                      vibe={event.tags && event.tags.length > 0 ? event.tags[0] : undefined}
                      host={event.creator 
                        ? {
                            id: event.creator.id,
                            name: event.creator.username || event.creator.email || "Host",
                            avatar: Array.isArray(event.creator.avatar_url)
                              ? event.creator.avatar_url[0]
                              : event.creator.avatar_url,
                          }
                        : undefined
                      }
                      location={event.venues?.name || event.location || ""}
                      date={formatFeaturedDate(event.start_date || "")}
                      time={event.start_time || undefined}
                      attendees={event.going_count || event.interested_count
                        ? {
                            count: (event.going_count ?? 0) + (event.interested_count ?? 0),
                            avatars: [],
                          }
                        : undefined
                      }
                      showRsvp={false}
                      className="h-full w-full rounded-md"  // subtle roundness
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-clay-earth">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-driftwood-grey" />
                  <p>No events match your selected vibe</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How The Lineup Works Section */}
      <section className="py-16 bg-white/50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-ocean-deep mb-4">
                How <span className="text-handwritten text-seafoam-green">The Lineup</span> Works
              </h2>
              <p className="text-lg text-clay-earth">
                Discover, connect, and experience amazing events in your area with just a few taps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 gradient-sky rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-ocean-deep">Discover Events</h3>
                <p className="text-clay-earth">
                  Browse events happening near you, from yoga sessions to beach parties and everything in between.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 gradient-sunset rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-ocean-deep">RSVP & Plan</h3>
                <p className="text-clay-earth">
                  Show interest or commit to going. Keep track of your plans and never miss out on what matters to you.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 gradient-ocean rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-ocean-deep">Connect & Enjoy</h3>
                <p className="text-clay-earth">
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
      <section className="py-16 gradient-ocean w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
              Ready to Find Your Next <span className="text-handwritten text-sunset-yellow">Adventure?</span>
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join our community and start discovering events that match your interests and vibe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-sunset text-white font-medium">
                <Link to="/events">
                  <Search className="mr-2 h-4 w-4" />
                  Explore Events
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
                <Link to="/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
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
