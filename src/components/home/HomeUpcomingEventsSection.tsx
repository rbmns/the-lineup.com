
import React from 'react';
import { Event } from '@/types';
import { UpcomingEventCard } from '@/components/home/UpcomingEventCard';
import { useNavigate } from 'react-router-dom';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { Loader2 } from 'lucide-react';
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
      <div className="py-8 md:py-12">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  const upcomingEvents = events?.slice(0, isMobile ? 4 : 6) || [];

  if (!upcomingEvents.length) {
    return (
      <div className="py-8 md:py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Upcoming Events</h2>
        <p className="text-gray-600">No upcoming events found.</p>
      </div>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Upcoming Events</h2>
        <button
          onClick={handleViewAllClick}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
        >
          View All →
        </button>
      </div>
      
      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      {isMobile ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ width: 'max-content' }}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
    </section>
  );
};
