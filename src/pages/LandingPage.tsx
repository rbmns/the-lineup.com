
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, Search, Map, ChevronLeft, ChevronRight, Edit, UserCircle, Sparkles, Coffee, MapPin, Clock } from 'lucide-react';
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

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { data: events, isLoading } = useEvents();
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { getEventImageUrl } = useEventImages();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { availableCategories } = useEventCategories(events);
  
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

  // Filter events by selected category
  const filteredEvents = React.useMemo(() => {
    if (!selectedCategory) return upcomingEvents;
    return upcomingEvents.filter(event => event.event_category === selectedCategory);
  }, [upcomingEvents, selectedCategory]);

  // Get categories that exist in upcoming events
  const availableCategoriesInUpcoming = React.useMemo(() => {
    if (!upcomingEvents || upcomingEvents.length === 0) return [];
    
    return Array.from(new Set(
      upcomingEvents
        .filter(event => event.event_category)
        .map(event => event.event_category as string)
    )).sort();
  }, [upcomingEvents]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prevCategory => prevCategory === category ? null : category);
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
    <div>
      {/* Hero Section with Updated Background */}
      <section className="relative bg-cover bg-center py-20" style={{
        backgroundImage: "url('/lovable-uploads/68eaf77e-c1bd-4326-bfdc-72328318f27d.png')"
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            See what's on in Zandvoort
          </h1>
          <p className="text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
            Discover local events and casual plans that fit your vibe. Explore what's happening nearby - music, surf, art, community, and more. Join events or post your own casual plans. Or, just browse events.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button asChild variant="outline" size="lg" className="border-2 bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/events">
                Explore Events
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/profile">
                Create Your Free Profile
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold tracking-tight">Upcoming Events</h2>
            <Link to="/events" className="text-blue-600 hover:text-blue-800 font-medium">
              View all →
            </Link>
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            <CategoryPill 
              category="All categories" 
              active={!selectedCategory} 
              noBorder={true} 
              onClick={() => setSelectedCategory(null)} 
            />
            {availableCategoriesInUpcoming.map((category) => (
              <CategoryPill 
                key={category}
                category={category} 
                active={selectedCategory === category} 
                noBorder={true} 
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
          
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="flex justify-center w-full py-8 col-span-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-black"></div>
              </div>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.slice(0, 3).map((event) => (
                <div 
                  key={event.id}
                  className="cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {formatFeaturedDate(event.start_date)} • {formatEventTime(event.start_time, event.end_time)}
                      </p>
                      <p className="text-sm text-gray-600">{event.venues?.name || event.location}</p>
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
      </section>

      {/* How The Lineup Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">How The Lineup Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
      </section>

      {/* Casual Plans Feature Section */}
      <CasualPlansHomeSection />

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Ready to Find Your Next Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
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
      </section>
    </div>
  );
};

export default LandingPage;
