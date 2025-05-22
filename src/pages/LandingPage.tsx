import React, { useRef, useState, useCallback } from 'react';
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

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { data: events, isLoading } = useEvents();
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { getEventImageUrl } = useEventImages();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
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
            Discover markets, music, wellness, and community events happening nearby — plus see what your friends recommend.
            Whether you're exploring alone or with others, the Lineup helps you dive into the local scene and make the most of your time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-black hover:bg-black/90 text-white">
              <Link to="/events">
                <Search className="mr-2 h-5 w-5" /> Search Events
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/login">
                Sign Up
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
          
          {/* Events Horizontal Slider */}
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
              className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory"
            >
              {isLoading ? (
                <div className="flex justify-center w-full py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-black"></div>
                </div>
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="min-w-[270px] sm:min-w-[300px] max-w-[300px] flex-shrink-0 snap-start"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="border rounded-lg overflow-hidden h-full cursor-pointer hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img 
                          src={event.image_urls && event.image_urls.length > 0 ? event.image_urls[0] : getEventImageUrl(event)} 
                          alt={event.title} 
                          className="w-full h-40 object-cover" 
                        />
                        {event.event_type && (
                          <div className="absolute top-2 left-2 z-10">
                            <CategoryPill 
                              category={event.event_type} 
                              active={true}
                              noBorder={true}
                            />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col h-[120px]">
                        <h3 className="font-semibold mb-1 line-clamp-2">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Map size={14} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{event.location || 'Location TBD'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-auto">
                          <Calendar size={14} className="mr-1 flex-shrink-0" />
                          <span>{event.start_date ? new Date(event.start_date).toLocaleDateString() : 'Date TBD'}</span>
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

      {/* How It Works Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground leading-relaxed text-center mb-12 max-w-2xl mx-auto">
            Create a profile to connect with friends and get personalized recommendations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow transform hover:translate-y-[-5px] transition-all duration-300">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">Tell us a bit about yourself and your vibe.</p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow transform hover:translate-y-[-5px] transition-all duration-300">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect with Friends</h3>
              <p className="text-muted-foreground">Find your crew and see what they're up to.</p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow transform hover:translate-y-[-5px] transition-all duration-300">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Events</h3>
              <p className="text-muted-foreground">Join local events your friends love.</p>
            </div>
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

      {/* Browse by Category Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">Browse by Category</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {eventTypes.map(type => (
              <Link 
                key={type} 
                to={`/events?type=${type}`} 
                className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-md transition-all border"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 text-white ${getCategoryColorState(type).active.split(' ')[0]}`}>
                  <span className="text-white font-bold">{type.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium">{type}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Join our community of adventurers</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with like-minded individuals, discover new experiences, and create
            unforgettable memories with The Lineup.
          </p>
          <Button asChild size="lg" className="bg-black hover:bg-black/90">
            <Link to="/login">
              Sign Up Now
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
