
import React from 'react';
import { Event } from '@/types';
import { UpcomingEventCard } from '@/components/home/UpcomingEventCard';
import { useNavigate } from 'react-router-dom';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HomeUpcomingEventsSectionProps {
  events: Event[] | undefined;
  isLoading: boolean;
}

export const HomeUpcomingEventsSection: React.FC<HomeUpcomingEventsSectionProps> = ({
  events,
  isLoading
}) => {
  const navigate = useNavigate();
  const { navigateToEvent } = useEventNavigation();
  const isMobile = useIsMobile();

  const handleEventClick = (event: Event) => {
    navigateToEvent(event);
  };

  const handleViewAllClick = () => {
    navigate('/events');
  };

  if (isLoading) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#2A9D8F]" />
          </div>
        </div>
      </div>
    );
  }

  const upcomingEvents = events?.slice(0, isMobile ? 4 : 6) || [];

  if (!upcomingEvents.length) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#005F73]">Upcoming Events</h2>
          <p className="text-[#005F73]/70 text-lg">No upcoming events found.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#005F73] mb-3">
              What's happening now
            </h2>
            <p className="text-[#005F73]/70 text-lg max-w-2xl">
              Discover events that match your energy — from sunrise yoga to sunset gatherings
            </p>
          </div>
          <button
            onClick={handleViewAllClick}
            className="hidden md:flex items-center gap-2 text-[#2A9D8F] hover:text-[#005F73] font-semibold text-lg transition-colors group"
          >
            View All 
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Events Grid */}
        {isMobile ? (
          // Mobile: Horizontal scroll
          <div className="overflow-x-auto pb-4 -mx-4">
            <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
              {upcomingEvents.map((event) => (
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
            {upcomingEvents.map((event) => (
              <UpcomingEventCard
                key={event.id}
                event={event}
                onClick={handleEventClick}
                className="h-full"
              />
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        {isMobile && (
          <div className="text-center mt-8">
            <button
              onClick={handleViewAllClick}
              className="inline-flex items-center gap-2 bg-[#2A9D8F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#005F73] transition-colors"
            >
              View All Events
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
