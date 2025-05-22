
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Music, Waves, Utensils, Dumbbell, Users, Search, Map, Heart, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { EventCategoryIcon } from '@/components/ui/event-category-icon';
import { Footer } from '@/components/ui/footer';
import { EventsSignupTeaser } from '@/components/events/list-components/EventsSignupTeaser';
import { useEvents } from '@/hooks/useEvents';
import EventCard from '@/components/EventCard';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { data: events, isLoading } = useEvents();
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Filter events for the next week and make sure we have one from each category if possible
  const featuredEvents = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    // Get events for the next week
    const nextWeekEvents = events.filter(event => {
      if (!event.start_date) return false;
      const eventDate = new Date(event.start_date);
      return eventDate <= oneWeekFromNow;
    });
    
    // Group by event type
    const eventsByType = nextWeekEvents.reduce((acc, event) => {
      if (!event.event_type) return acc;
      if (!acc[event.event_type]) acc[event.event_type] = [];
      acc[event.event_type].push(event);
      return acc;
    }, {} as Record<string, typeof events>);
    
    // Get one event from each type
    const featured = Object.values(eventsByType).map(typeEvents => typeEvents[0]).slice(0, 6);
    
    return featured;
  }, [events]);

  const scrollEvents = (direction: 'left' | 'right') => {
    if (!eventsContainerRef.current) return;
    
    const container = eventsContainerRef.current;
    const scrollAmount = container.clientWidth * (direction === 'left' ? -0.8 : 0.8);
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const categoryTypes = [
    { type: 'all', label: 'All' },
    { type: 'surf', label: 'Surf' },
    { type: 'yoga', label: 'Yoga' },
    { type: 'beach', label: 'Beach' },
    { type: 'music', label: 'Music' },
    { type: 'food', label: 'Food' },
    { type: 'workshop', label: 'Workshop' },
    { type: 'community', label: 'Community' },
    { type: 'wellness', label: 'Wellness' }, 
    { type: 'location', label: 'Location' },
    { type: 'event', label: 'Event' },
  ];

  const filteredEvents = activeCategory === 'all' 
    ? featuredEvents 
    : featuredEvents.filter(event => event.event_type === activeCategory);

  return (
    <div>
      {/* Hero Section with Blue Background */}
      <section className="bg-blue-500 py-12 md:py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover local events and connect with friends
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Find yoga sessions, surf lessons, beach activities and more in your area
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-black hover:bg-black/90 text-white">
              <Link to="/events">
                Explore Events
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/events">
                Create Event
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Events Section with Category Pills */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
          
          {/* Category Pills */}
          <div className="overflow-x-auto pb-4 mb-4 no-scrollbar">
            <div className="flex gap-2">
              {categoryTypes.map(category => (
                <button
                  key={category.type}
                  onClick={() => setActiveCategory(category.type)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    activeCategory === category.type 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
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
                  >
                    <div className="border rounded-lg overflow-hidden h-full">
                      {event.image_url && (
                        <div className="relative">
                          <img 
                            src={event.image_url} 
                            alt={event.title} 
                            className="w-full h-40 object-cover" 
                          />
                          {event.event_type && (
                            <div className="absolute top-2 right-2">
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">{event.event_type}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Map size={14} className="mr-1" />
                          <span>{event.location || 'Location TBD'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-1" />
                          <span>{event.start_date ? new Date(event.start_date).toLocaleDateString() : 'Date TBD'}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="w-full">
                            RSVP
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center w-full py-8">
                  <p>No events found for this category</p>
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

      {/* Browse by Category Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <Link to="/events" className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <span className="text-blue-500 font-bold">S</span>
              </div>
              <span className="text-sm font-medium">Surf</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <span className="text-green-500 font-bold">Y</span>
              </div>
              <span className="text-sm font-medium">Yoga</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                <span className="text-yellow-600 font-bold">B</span>
              </div>
              <span className="text-sm font-medium">Beach</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <span className="text-purple-500 font-bold">M</span>
              </div>
              <span className="text-sm font-medium">Music</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                <span className="text-red-500 font-bold">F</span>
              </div>
              <span className="text-sm font-medium">Food</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <span className="text-orange-500 font-bold">W</span>
              </div>
              <span className="text-sm font-medium">Workshop</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mb-2">
                <span className="text-cyan-500 font-bold">C</span>
              </div>
              <span className="text-sm font-medium">Community</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <span className="text-emerald-500 font-bold">W</span>
              </div>
              <span className="text-sm font-medium">Wellness</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                <span className="text-indigo-500 font-bold">L</span>
              </div>
              <span className="text-sm font-medium">Location</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-2">
                <span className="text-pink-500 font-bold">E</span>
              </div>
              <span className="text-sm font-medium">Event</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">All</Button>
              <Button variant="outline" size="sm" className="hidden sm:block">My Events</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="border rounded-lg overflow-hidden">
                {event.image_url && (
                  <div className="relative">
                    <img 
                      src={event.image_url} 
                      alt={event.title} 
                      className="w-full h-40 object-cover" 
                    />
                    {event.event_type && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">{event.event_type}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{event.title}</h3>
                  <div className="flex flex-col text-sm text-gray-600">
                    <div className="flex items-center mb-1">
                      <Calendar size={14} className="mr-1" />
                      <span>{event.start_date ? new Date(event.start_date).toLocaleDateString() : 'Date TBD'}</span>
                    </div>
                    <div className="flex items-center">
                      <Map size={14} className="mr-1" />
                      <span>{event.location || 'Location TBD'}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" className="w-full">RSVP</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button variant="outline">View All Events</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join our community of adventurers</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Connect with like-minded individuals, discover new experiences, and create
            unforgettable memories with The Lineup.
          </p>
          <Button size="lg" className="bg-black hover:bg-black/90">Sign Up Now</Button>
        </div>
      </section>
      
      {/* Add CSS for hiding scrollbars but allowing scrolling */}
      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera*/
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
