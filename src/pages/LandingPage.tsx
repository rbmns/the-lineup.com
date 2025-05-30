
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

  // Get unique event types from upcoming events
  const eventTypes = React.useMemo(() => {
    if (!upcomingEvents || upcomingEvents.length === 0) return [];
    
    return Array.from(new Set(
      upcomingEvents
        .filter(event => event.event_category)
        .map(event => event.event_category as string)
    )).sort();
  }, [upcomingEvents]);

  // Get all event types from all events, not just upcoming ones
  const allEventTypes = React.useMemo(() => {
    if (!events || events.length === 0) return [];
    
    const eventTypesFromData = Array.from(new Set(
      events
        .filter(event => event.event_category)
        .map(event => event.event_category as string)
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
      {/* Hero Section with Updated Background */}
      <section className="relative bg-cover bg-center py-20" style={{
        backgroundImage: "url('/lovable-uploads/68eaf77e-c1bd-4326-bfdc-72328318f27d.png')"
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Find events and plans that fit your vibe
          </h1>
          <p className="text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
            Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button asChild variant="outline" size="lg" className="border-2 bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/events">
                Explore Events
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/profile">
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
                      {event.event_category && (
                        <div className="absolute top-3 left-3">
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

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">What People Are Saying</h2>
            <p className="text-lg text-gray-600">
              Join thousands of people who are already discovering amazing events through The Lineup.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  S
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">Sarah</h4>
                  <p className="text-sm text-gray-600">Yoga Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-700">
                "I've discovered so many amazing yoga sessions and wellness events through The Lineup. It's become my go-to for finding my tribe!"
              </p>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  M
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">Miguel</h4>
                  <p className="text-sm text-gray-600">Surf Instructor</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The lineup helps me connect with fellow surfers and discover new beach events. Perfect for staying connected with the community."
              </p>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">Anna</h4>
                  <p className="text-sm text-gray-600">Food Lover</p>
                </div>
              </div>
              <p className="text-gray-700">
                "From food festivals to intimate dinner events, I never miss out on culinary experiences anymore. Love the variety!"
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Ready to Find Your Next Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community and start discovering events that match your interests and vibe.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-blue-600 bg-white hover:bg-gray-100">
              <Link to="/events">
                Explore Events
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 bg-transparent border-white text-white hover:bg-white/10">
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
