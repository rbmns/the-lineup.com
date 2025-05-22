
import React, { useRef } from 'react';
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
    const featured = Object.values(eventsByType).map(typeEvents => typeEvents[0]).slice(0, 4);
    
    return featured;
  }, [events]);

  const scrollEvents = (direction: 'left' | 'right') => {
    if (!eventsContainerRef.current) return;
    
    const container = eventsContainerRef.current;
    const scrollAmount = container.clientWidth * (direction === 'left' ? -0.8 : 0.8);
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="container px-4 mx-auto">
      {/* Hero Section - Optimized for mobile */}
      <section className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 md:mb-4">
            Find the Best Local Events — Beachlife, Markets, Music & More
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-5">
            Whether you're flying solo or meeting up with friends, the Lineup helps you explore Zandvoort's best local vibes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-black hover:bg-black/90 text-white font-inter">
              <Link to={isAuthenticated ? "/profile" : "/signup"}>
                Create Your Free Profile
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2">
              <Link to="/events">
                Just Browse Events
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <hr className="border-t border-gray-200 my-6" />

      {/* Featured Events Section - With horizontal slider */}
      <section className="py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Featured Events This Week</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hidden md:flex"
                onClick={() => scrollEvents('left')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hidden md:flex"
                onClick={() => scrollEvents('right')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : featuredEvents.length > 0 ? (
            <div 
              ref={eventsContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none' }}
            >
              {featuredEvents.map(event => (
                <div 
                  key={event.id} 
                  className="min-w-[280px] md:min-w-[320px] flex-shrink-0 snap-start"
                >
                  <EventCard 
                    event={event} 
                    compact={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-lg text-gray-600">No upcoming events this week. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <hr className="border-t border-gray-200 my-6" />

      {/* How It Works Section with Icons */}
      <section className="py-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-6">How It Works</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="p-5 flex flex-col items-center text-center h-full">
              <Search className="h-10 w-10 text-purple-600 mb-3" />
              <h3 className="text-lg font-medium mb-2">Explore Local Events</h3>
              <p className="text-gray-600 text-sm">
                Browse beachlife happenings — from markets and music to wellness and surf sessions. RSVP to your favorites with one click.
              </p>
            </Card>
            
            <Card className="p-5 flex flex-col items-center text-center h-full">
              <Map className="h-10 w-10 text-blue-600 mb-3" />
              <h3 className="text-lg font-medium mb-2">See Who's Around</h3>
              <p className="text-gray-600 text-sm">
                Spot which friends are nearby or planning to attend the same events — if they choose to share.
              </p>
            </Card>
            
            <Card className="p-5 flex flex-col items-center text-center h-full">
              <Heart className="h-10 w-10 text-red-600 mb-3" />
              <h3 className="text-lg font-medium mb-2">Get Inspired by Friends</h3>
              <p className="text-gray-600 text-sm">
                See what your friends are saving, loving, or recommending. Discover new vibes through your crew.
              </p>
            </Card>
            
            <Card className="p-5 flex flex-col items-center text-center h-full">
              <MessageSquare className="h-10 w-10 text-green-600 mb-3" />
              <h3 className="text-lg font-medium mb-2">Plan Together</h3>
              <p className="text-gray-600 text-sm">
                Chat, sync up plans, or invite friends to join you — and make the most of your time together.
              </p>
            </Card>
          </div>
          
          <div className="mt-5 text-center">
            <p className="text-gray-600 mb-2">
              Not ready to share? No worries — <Link to="/events" className="text-blue-600 hover:underline">browse events anonymously</Link>.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-t border-gray-200 my-6" />

      {/* Event Types Section */}
      <section className="py-6 bg-gray-50 rounded-xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-4">Discover Events By Type</h2>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-center">
            <Link to="/events" className="flex flex-col items-center p-3 hover:bg-white rounded-lg transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Music size={24} strokeWidth={1.5} className="text-purple-600" />
              </div>
              <span className="font-medium text-sm">Music & Festivals</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 hover:bg-white rounded-lg transition-colors">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Waves size={24} strokeWidth={1.5} className="text-blue-600" />
              </div>
              <span className="font-medium text-sm">Beach & Wellness</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 hover:bg-white rounded-lg transition-colors">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <Utensils size={24} strokeWidth={1.5} className="text-orange-600" />
              </div>
              <span className="font-medium text-sm">Food Trucks</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 hover:bg-white rounded-lg transition-colors">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Dumbbell size={24} strokeWidth={1.5} className="text-green-600" />
              </div>
              <span className="font-medium text-sm">Sports & Games</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 hover:bg-white rounded-lg transition-colors">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                <Calendar size={24} strokeWidth={1.5} className="text-red-600" />
              </div>
              <span className="font-medium text-sm">Arts & Culture</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 hover:bg-white rounded-lg transition-colors">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                <Users size={24} strokeWidth={1.5} className="text-indigo-600" />
              </div>
              <span className="font-medium text-sm">Community</span>
            </Link>
          </div>
        </div>
      </section>

      <hr className="border-t border-gray-200 my-6" />

      {/* Call to Action section */}
      <section className="py-8 mb-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-5">Ready to explore like a local?</h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-black hover:bg-black/90 text-white font-inter">
              <Link to={isAuthenticated ? "/events" : "/signup"}>
                Create a Free Account
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="font-inter">
              <Link to="/events">
                Just Browse Events
              </Link>
            </Button>
          </div>
          
          <p className="mt-4 text-lg">Find your lineup and connect with local events.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
