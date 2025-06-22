
import React, { useState, useMemo } from 'react';
import { Event } from '@/types';
import { UpcomingEventCard } from '@/components/home/UpcomingEventCard';
import { useNavigate } from 'react-router-dom';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface HomeUpcomingEventsSectionProps {
  events: Event[] | undefined;
  isLoading: boolean;
}

const getVibeColor = (vibe: string): string => {
  const vibeColors: Record<string, string> = {
    party: '#FF6B4A',
    chill: '#66B2B2',
    wellness: '#FF9933',
    active: '#005F73',
    social: '#FF6B4A',
    creative: '#66B2B2',
    adventure: '#005F73',
    mindful: '#FF9933',
    relaxed: '#66B2B2',
    spiritual: '#FF9933'
  };
  return vibeColors[vibe.toLowerCase()] || '#005F73';
};

export const HomeUpcomingEventsSection: React.FC<HomeUpcomingEventsSectionProps> = ({
  events,
  isLoading
}) => {
  const navigate = useNavigate();
  const { navigateToEvent } = useEventNavigation();
  const isMobile = useIsMobile();
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  // Get available vibes from the actual events
  const availableVibes = useMemo(() => {
    if (!events) return [];
    const vibes = events
      .map(event => event.vibe)
      .filter(Boolean)
      .filter((vibe, index, array) => array.indexOf(vibe) === index)
      .sort();
    return vibes as string[];
  }, [events]);

  // Filter events by selected vibe
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (!selectedVibe) return events;
    return events.filter(event => event.vibe?.toLowerCase() === selectedVibe.toLowerCase());
  }, [events, selectedVibe]);
  
  const displayEvents = filteredEvents?.slice(0, isMobile ? 4 : 6) || [];
  
  const handleEventClick = (event: Event) => {
    navigateToEvent(event);
  };
  
  const handleViewAllClick = () => {
    navigate('/events');
  };
  
  const handleVibeClick = (vibe: string | null) => {
    setSelectedVibe(vibe);
  };
  
  if (isLoading) {
    return (
      <div className="py-16 bg-gradient-to-br from-secondary-10 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-secondary-10 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-vibrant-seafoam/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-vibrant-coral/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-vibrant-sunset/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-8 text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary">
            Upcoming Events
          </h2>
          <p className="text-lg max-w-2xl text-primary/70">
            Discover events that match your energy — from sunrise yoga to sunset gatherings
          </p>
        </div>

        {/* Vibe filters */}
        {availableVibes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-primary mb-4 text-left">Find your vibe</h3>
            <div className="flex justify-start">
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar max-w-full">
                <button 
                  onClick={() => handleVibeClick(null)} 
                  className={cn(
                    "flex-shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
                    !selectedVibe 
                      ? "bg-primary text-white shadow-lg transform scale-105" 
                      : "bg-white text-primary hover:bg-secondary-25 border border-neutral-25"
                  )}
                >
                  All Vibes
                </button>
                {availableVibes.map(vibe => {
                  const color = getVibeColor(vibe);
                  const isSelected = selectedVibe === vibe;
                  return (
                    <button 
                      key={vibe} 
                      onClick={() => handleVibeClick(vibe)} 
                      className={cn(
                        "flex-shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 capitalize border transform",
                        isSelected 
                          ? "text-white shadow-lg scale-105 border-transparent" 
                          : "bg-white text-primary hover:shadow-md border-neutral-25 hover:scale-102"
                      )}
                      style={isSelected ? {
                        backgroundColor: color,
                        boxShadow: `0 8px 25px ${color}30`
                      } : {}}
                    >
                      {vibe}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Events Grid */}
        {displayEvents.length === 0 && !isLoading ? (
          <div className="text-center py-12 bg-white/50 rounded-2xl backdrop-blur-sm">
            <p className="text-primary text-lg mb-4">
              {selectedVibe ? `No ${selectedVibe} events found at the moment` : 'No upcoming events found.'}
            </p>
            {selectedVibe && (
              <button 
                onClick={() => handleVibeClick(null)} 
                className="text-primary hover:text-primary/80 font-semibold"
              >
                Show all events
              </button>
            )}
          </div>
        ) : isMobile ? (
          // Mobile: Horizontal scroll
          <div className="overflow-x-auto pb-4 -mx-4">
            <div className="flex gap-6 px-4" style={{ width: 'max-content' }}>
              {displayEvents.map(event => (
                <div key={event.id} className="flex-none w-80">
                  <UpcomingEventCard 
                    event={event} 
                    onClick={handleEventClick} 
                    className="h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Desktop: Grid with larger cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayEvents.map(event => (
              <UpcomingEventCard 
                key={event.id} 
                event={event} 
                onClick={handleEventClick} 
                className="h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        {displayEvents.length > 0 && (
          <div className="text-center mt-12">
            <button 
              onClick={handleViewAllClick} 
              className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 group hover:bg-primary/90 hover:shadow-xl transform hover:scale-105"
            >
              View All Events
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
