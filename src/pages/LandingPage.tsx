
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Search, Map, ChevronLeft, ChevronRight, Edit, UserCircle, Sparkles } from 'lucide-react';
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
import { CategoriesBrowseSection } from '@/components/home/CategoriesBrowseSection';

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
    
    // Group by event type to ensure diversity
    const eventsByType = nextWeekEvents.reduce((acc, event) => {
      if (!event.event_type) return acc;
      if (!acc[event.event_type]) acc[event.event_type] = [];
      acc[event.event_type].push(event);
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
    return upcomingEvents.filter(event => event.event_type === selectedCategory);
  }, [upcomingEvents, selectedCategory]);

  // Get unique event types from upcoming events
  const eventTypes = React.useMemo(() => {
    if (!upcomingEvents || upcomingEvents.length === 0) return [];
    
    return Array.from(new Set(
      upcomingEvents
        .filter(event => event.event_type)
        .map(event => event.event_type as string)
    )).sort();
  }, [upcomingEvents]);

  // Get all event types from all events, not just upcoming ones - UPDATED to include art & culture
  const allEventTypes = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    
    const eventTypesFromData = Array.from(new Set(
      events
        .filter(event => event.event_type)
        .map(event => event.event_type as string)
    ));
    
    // Make sure to include art & culture even if not in data
    const allTypes = [...eventTypesFromData];
    if (!allTypes.includes('art & culture')) {
      allTypes.push('art & culture');
    }
    
    return allTypes.sort();
  }, [events]);

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
      {/* Hero Section with Blue Background */}
      <section className="bg-blue-500 py-12 md:py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
           Connect with the Local Vibe
          </h1>
          <p className="text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
Discover local events and casual plans that fit your vibe. Explore what’s happening nearby — music, surf, art, community, and more. 
Join events or post your own casual plans. Or just browse events. 
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-black hover:bg-black/90 text-white">
              <Link to="/events">
                <Search className="mr-2 h-5 w-5" /> Explore Events
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/login">
                Create Your Free Profile
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">Upcoming Events</h2>
          
          {/* Category Pills */}
          {eventTypes.length > 0 && (
            <div className="overflow-x-auto pb-4 mb-4 no-scrollbar">
              <div className="flex gap-2">
                {eventTypes.map(type => (
                  <CategoryPill
                    key={type}
                    category={type}
                    active={selectedCategory === type}
                    noBorder={true}
                    onClick={() => handleCategoryClick(type)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Events Horizontal Slider - UPDATED for larger cards with reduced whitespace */}
          <div className="relative">
            <div className="absolute top-1/2 left-0 -ml-4 z-10 transform -translate-y-1/2 hidden md:block">
              <button 
                onClick={() => scrollEvents('left')}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            
            <div 
              ref={eventsContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory"
            >
              {isLoading ? (
                <div className="flex justify-center w-full py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-black"></div>
                </div>
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="min-w-[400px] max-w-[400px] flex-shrink-0 snap-start"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="border rounded-lg overflow-hidden h-full cursor-pointer hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img 
                          src={event.image_urls && event.image_urls.length > 0 ? event.image_urls[0] : getEventImageUrl(event)} 
                          alt={event.title} 
                          className="w-full h-56 object-cover" 
                        />
                        {event.event_type && (
                          <div className="absolute top-3 left-3 z-10">
                            <CategoryPill 
                              category={event.event_type} 
                              active={true}
                              noBorder={true}
                            />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Map size={16} className="mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {event.venues?.name || event.location || 'Location TBD'}
                          </span>
                        </div>
                        <div className="flex items-center text-base font-medium text-gray-800">
                          <Calendar size={16} className="mr-2 flex-shrink-0" />
                          <span>
                            {event.start_date && event.start_time ? 
                              `${formatFeaturedDate(event.start_date)}, ${formatEventTime(event.start_time, event.end_time)}` :
                              event.start_date ? formatFeaturedDate(event.start_date) : 'Date TBD'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center w-full py-8">
                  <p>No upcoming events found</p>
                </div>
              )}
            </div>
            
            <div className="absolute top-1/2 right-0 -mr-4 z-10 transform -translate-y-1/2 hidden md:block">
              <button 
                onClick={() => scrollEvents('right')}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Categories Section */}
      <CategoriesBrowseSection categories={allEventTypes} />

      {/* How It Works Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground leading-relaxed text-center mb-12 max-w-2xl mx-auto">
            Create a profile to connect with friends and get personalized recommendations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Link 
              to="/signup"
              className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow transform hover:translate-y-[-5px] transition-all duration-300 block"
            >
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">Tell us a bit about yourself and your vibe.</p>
            </Link>
            
            {/* Step 2 */}
            <Link 
              to="/friends"
              className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow transform hover:translate-y-[-5px] transition-all duration-300 block"
            >
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect with Friends</h3>
              <p className="text-muted-foreground">Find your crew and see what they're up to.</p>
            </Link>
            
            {/* Step 3 */}
            <Link 
              to="/events"
              className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow transform hover:translate-y-[-5px] transition-all duration-300 block"
            >
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Events</h3>
              <p className="text-muted-foreground">Join local events your friends love.</p>
            </Link>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/events">
                Or... Just Browse Events
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Want to connect with others attending?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Sign up to join events, meet people, and save your favorites. 
          </p>
          <Button asChild size="lg" className="bg-black hover:bg-black/90">
            <Link to="/login">
              Sign Up – It's Free
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Add CSS for hiding scrollbars but allowing scrolling */}
      <style>
        {`
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera*/
        }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
