
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { useEventImages } from '@/hooks/useEventImages';
import { useAuth } from '@/contexts/AuthContext';
import { formatEventCardDateTime } from '@/utils/date-formatting';
import { getVibeColors } from '@/utils/vibeColors';

interface HomeEventsPreviewProps {
  events: Event[] | undefined;
  isLoading: boolean;
}

export const HomeEventsPreview: React.FC<HomeEventsPreviewProps> = ({
  events,
  isLoading
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const displayEvents = events?.slice(0, 6) || [];

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-midnight mb-4">Upcoming Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-ivory border border-overcast rounded-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-overcast/20"></div>
                <div className="p-4">
                  <div className="h-4 bg-overcast/20 rounded mb-3"></div>
                  <div className="h-3 bg-overcast/20 rounded mb-2"></div>
                  <div className="h-3 bg-overcast/20 rounded mb-3"></div>
                  <div className="h-6 bg-overcast/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl text-midnight mb-4">Upcoming Events</h2>
          <p className="text-lg text-overcast max-w-2xl mx-auto font-body">
            Join others in experiences that match your interests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayEvents.map((event) => {
            const EventCardContent = () => {
              const { getEventImageUrl } = useEventImages();
              const imageUrl = getEventImageUrl(event);

              const getVenueDisplay = (): string => {
                if (event.venues?.name) {
                  return event.venues.name;
                }
                
                if (event.location) {
                  return event.location;
                }
                
                return 'Location TBD';
              };

              return (
                <div 
                  className="bg-ivory border border-overcast rounded-sm p-4 sm:p-6 cursor-pointer transition-colors hover:bg-coconut w-full h-full flex flex-col"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  {/* Image */}
                  <div className="w-full h-48 mb-4 overflow-hidden rounded-sm relative">
                    <img
                      src={imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover filter-cinematic"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('/img/default.jpg')) {
                          target.src = "/img/default.jpg";
                        }
                      }}
                    />

                    {/* Event vibe pill - top right */}
                    {event.vibe && (
                      <div className="absolute top-3 right-3 z-10">
                        <span 
                          className="text-xs font-mono px-2 py-0.5 rounded lowercase"
                          style={{
                            backgroundColor: getVibeColors(event.vibe).bg,
                            color: getVibeColors(event.vibe).text
                          }}
                        >
                          {event.vibe}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg text-midnight mb-3 leading-tight">
                    {event.title}
                  </h3>

                  {/* Organizer info */}
                  {event.organiser_name && (
                    <p className="font-mono text-xs text-overcast mb-3">
                      By {event.organiser_name}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="font-mono text-xs text-overcast space-y-1 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {getVenueDisplay()}
                      </span>
                    </div>
                  </div>

                  {/* Description preview */}
                  {event.description && (
                    <p className="text-sm text-midnight font-body leading-relaxed line-clamp-3 mb-4 flex-1">
                      {event.description}
                    </p>
                  )}

                  {/* Tags/Vibes and Category */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.event_category && (
                      <span className="bg-sage text-midnight text-xs font-mono px-2 py-0.5 rounded lowercase">
                        {event.event_category}
                      </span>
                    )}
                  </div>

                  {/* Join Button - only show for authenticated users */}
                  {isAuthenticated && (
                    <div className="mt-auto">
                      <button
                        className="bg-clay text-midnight text-sm font-body px-4 py-2 rounded-sm hover:bg-seafoam transition-colors w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${event.id}`);
                        }}
                      >
                        Join Event
                      </button>
                    </div>
                  )}
                </div>
              );
            };

            return <EventCardContent key={event.id} />;
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/events')}
            size="lg"
            variant="outline"
            className="border-2 border-overcast/20 text-midnight hover:bg-coconut px-8 font-body"
          >
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
};
