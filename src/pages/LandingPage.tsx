
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
import { Card, CardContent } from '@/components/ui/card';

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

  // Get all event types from all events, not just upcoming ones
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
      {/* Hero Section with Search */}
      <section className="relative bg-cover bg-center py-20" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Find events and plans that fit your vibe
          </h1>
          <p className="text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
            Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want.
          </p>
          
          {/* Search Card */}
          <Card className="max-w-md mx-auto bg-white text-black">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-left text-sm font-medium mb-2">Where are you headed?</label>
                <input 
                  type="text" 
                  placeholder="Zandvoort" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="This weekend" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button asChild className="w-full bg-black hover:bg-black/90">
                <Link to="/events">
                  <Search className="mr-2 h-4 w-4" /> Find Events
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button asChild variant="outline" size="lg" className="border-2 bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/events">
                Explore Events
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/casual-plans">
                Create Profile
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Find Your Vibe Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold tracking-tight">Find your vibe</h2>
            <Link to="/events" className="text-blue-600 hover:text-blue-800 font-medium">
              View all →
            </Link>
          </div>
          
          {/* Vibe Categories */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            <CategoryPill category="All Vibes" active={true} noBorder={true} />
            <CategoryPill category="Chill" active={false} noBorder={true} />
            <CategoryPill category="Active" active={false} noBorder={true} />
            <CategoryPill category="Adventurous" active={false} noBorder={true} />
            <CategoryPill category="Wellness" active={false} noBorder={true} />
            <CategoryPill category="Culture" active={false} noBorder={true} />
            <CategoryPill category="Creative" active={false} noBorder={true} />
            <CategoryPill category="Sandy" active={false} noBorder={true} />
            <CategoryPill category="Music" active={false} noBorder={true} />
            <CategoryPill category="Surf" active={false} noBorder={true} />
            <CategoryPill category="Food" active={false} noBorder={true} />
            <CategoryPill category="Market" active={false} noBorder={true} />
            <CategoryPill category="Festival" active={false} noBorder={true} />
            <CategoryPill category="Culture" active={false} noBorder={true} />
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
            <CategoryPill category="All categories" active={!selectedCategory} noBorder={true} onClick={() => setSelectedCategory(null)} />
            <CategoryPill category="Market" active={false} noBorder={true} />
            <CategoryPill category="Surf" active={false} noBorder={true} />
            <CategoryPill category="Festival" active={false} noBorder={true} />
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
                      <img 
                        src={event.image_urls && event.image_urls.length > 0 ? event.image_urls[0] : getEventImageUrl(event)} 
                        alt={event.title} 
                        className="w-full h-48 object-cover" 
                      />
                      {event.event_type && (
                        <div className="absolute top-3 left-3">
                          <CategoryPill 
                            category={event.event_type} 
                            active={true}
                            noBorder={true}
                          />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Map size={14} className="mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {event.venues?.name || event.location || 'Location TBD'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-800 mb-4">
                        <Calendar size={14} className="mr-1 flex-shrink-0" />
                        <span>
                          {event.start_date && event.start_time ? 
                            `${formatFeaturedDate(event.start_date)}, ${formatEventTime(event.start_time, event.end_time)}` :
                            event.start_date ? formatFeaturedDate(event.start_date) : 'Date TBD'
                          }
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">Going</Button>
                        <Button size="sm" variant="outline" className="flex-1">Interested</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="flex justify-center w-full py-8 col-span-3">
                <p>No upcoming events found</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How The Lineup Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">How The Lineup Works</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover events and connect with others - all on your terms.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Events</h3>
              <p className="text-gray-600">Find events that match your interests and schedule.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect If You Want</h3>
              <p className="text-gray-600">Meet new people or just enjoy the event. It's up to you.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join Casual Plans</h3>
              <p className="text-gray-600">No formal events? No problem. Organize casual meetups with locals.</p>
            </div>
          </div>
          
          <Button asChild className="mt-8 bg-black hover:bg-black/90">
            <Link to="/events">
              Explore All Events
            </Link>
          </Button>
        </div>
      </section>

      {/* Browse by Category */}
      <CategoriesBrowseSection categories={allEventTypes} />

      {/* What Travelers Are Saying */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">What Travelers Are Saying</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <p className="text-lg italic mb-4">"The Lineup helped me discover amazing local events during my stay and connected me with like-minded travelers that made the experience even better like a local!"</p>
                <div className="font-semibold">Sarah K.</div>
                <div className="text-sm text-gray-600">Digital Nomad</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-lg italic mb-4">"I found a casual beach volleyball meetup through The Lineup and ended up making friends that I met up with several times during my Amsterdam trip for epic adventures."</p>
                <div className="font-semibold">Michael T.</div>
                <div className="text-sm text-gray-600">Traveler from Canada</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-lg italic mb-4">"As someone who travels for work, The Lineup has helped me find connection in each place I visit by joining some music plans that suit my social needs as someone extrovert."</p>
                <div className="font-semibold">Ava L.</div>
                <div className="text-sm text-gray-600">Business Traveler</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Want to connect with others attending? */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Want to connect with others attending?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Sign up to join events, meet people, and save your favorites.
          </p>
          <Button asChild size="lg" className="bg-black hover:bg-black/90">
            <Link to="/signup">
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
