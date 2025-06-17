
import React, { useState, useMemo } from 'react';
import { Event } from '@/types';
import { UpcomingEventCard } from '@/components/home/UpcomingEventCard';
import { useNavigate } from 'react-router-dom';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { useEventVibes } from '@/hooks/useEventVibes';
import { Loader2, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface HomeUpcomingEventsSectionProps {
  events: Event[] | undefined;
  isLoading: boolean;
}

const getVibeColor = (vibe: string): string => {
  const vibeColors: Record<string, string> = {
    party: '#F43F5E',
    chill: '#10B981',
    wellness: '#8B5CF6',
    active: '#F59E0B',
    social: '#EC4899',
    creative: '#6366F1',
    adventure: '#059669',
    mindful: '#84CC16',
    relaxed: '#F97316',
    spiritual: '#A855F7'
  };
  return vibeColors[vibe.toLowerCase()] || '#6B7280';
};

export const HomeUpcomingEventsSection: React.FC<HomeUpcomingEventsSectionProps> = ({
  events,
  isLoading
}) => {
  const navigate = useNavigate();
  const {
    navigateToEvent
  } = useEventNavigation();
  const {
    data: vibes = [],
    isLoading: vibesLoading
  } = useEventVibes();
  const isMobile = useIsMobile();
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

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
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Upcoming Events
          </h2>
          <p className="text-lg max-w-2xl text-gray-700">
            Discover events that match your energy — from sunrise yoga to sunset gatherings
          </p>
        </div>

        {/* Vibe Filter Pills */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Find your vibe</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => handleVibeClick(null)} 
              className={cn(
                "flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                !selectedVibe 
                  ? "bg-gray-900 text-white shadow-md" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              All Vibes
            </button>
            {vibesLoading ? (
              // Loading state for vibes
              <>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex-shrink-0 h-9 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                ))}
              </>
            ) : (
              vibes.map(vibe => {
                const color = getVibeColor(vibe);
                const isSelected = selectedVibe === vibe;
                return (
                  <button 
                    key={vibe} 
                    onClick={() => handleVibeClick(vibe)} 
                    className={cn(
                      "flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 capitalize border",
                      isSelected 
                        ? "text-white shadow-md border-transparent" 
                        : "bg-white text-gray-700 hover:shadow-sm border-gray-200"
                    )}
                    style={isSelected ? {
                      backgroundColor: color,
                      boxShadow: `0 4px 12px ${color}20`
                    } : {}}
                  >
                    {vibe}
                  </button>
                );
              })
            )}
          </div>
        </div>
        
        {/* Events Grid */}
        {displayEvents.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              {selectedVibe ? `No ${selectedVibe} events found at the moment` : 'No upcoming events found.'}
            </p>
            {selectedVibe && (
              <button 
                onClick={() => handleVibeClick(null)} 
                className="text-gray-900 hover:text-gray-700 font-semibold"
              >
                Show all events
              </button>
            )}
          </div>
        ) : isMobile ? (
          // Mobile: Horizontal scroll
          <div className="overflow-x-auto pb-4 -mx-4">
            <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
              {displayEvents.map(event => (
                <div key={event.id} className="flex-none w-72">
                  <UpcomingEventCard 
                    event={event} 
                    onClick={handleEventClick} 
                    className="h-full" 
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Desktop: Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map(event => (
              <UpcomingEventCard 
                key={event.id} 
                event={event} 
                onClick={handleEventClick} 
                className="h-full" 
              />
            ))}
          </div>
        )}

        {/* View All Button - Below Events */}
        {displayEvents.length > 0 && (
          <div className="text-center mt-8">
            <button 
              onClick={handleViewAllClick} 
              className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 font-semibold text-lg transition-colors group"
            >
              View All Events
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
