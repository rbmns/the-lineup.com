
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useEventImages } from '@/hooks/useEventImages';
import { LineupImage } from '@/components/ui/lineup-image';
import { useAuth } from '@/contexts/AuthContext';
import EventVibeLabel from '@/components/polymet/event-vibe-label';
import { formatEventCardDateTime } from '@/utils/date-formatting';
import { Card } from '@/components/ui/card';

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
      <section className="py-16 bg-secondary-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Upcoming Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Upcoming Events</h2>
          <p className="text-lg text-neutral max-w-2xl mx-auto">
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
                <Card 
                  className="flex flex-col h-full overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl bg-white border border-gray-200 rounded-xl group"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  {/* Image with vibe pill only - reduced height */}
                  <div className="relative w-full h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                    <LineupImage
                      src={imageUrl}
                      alt={event.title}
                      aspectRatio="video"
                      treatment="subtle-overlay"
                      overlayVariant="ocean"
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('/img/default.jpg')) {
                          target.src = "/img/default.jpg";
                        }
                      }}
                    />

                    {/* Event vibe pill - top right only */}
                    <div className="absolute top-3 right-3 z-10">
                      <EventVibeLabel 
                        vibe={event.vibe || 'general'} 
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-4 space-y-3">
                    {/* Event Title */}
                    <h3 className="font-semibold text-primary text-lg leading-tight line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Organizer info */}
                    {event.organiser_name && (
                      <p className="text-sm text-primary/70">
                        By {event.organiser_name}
                      </p>
                    )}

                    {/* Date & Time - using improved formatting for ongoing events */}
                    <div className="flex items-center gap-2 text-neutral">
                      <Calendar className="h-4 w-4 text-primary/60" />
                      <span className="text-sm font-medium">
                        {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-neutral">
                      <MapPin className="h-4 w-4 text-primary/60" />
                      <span className="text-sm truncate">
                        {getVenueDisplay()}
                      </span>
                    </div>

                    {/* Attendees and Join Button - reduced padding */}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      {(event.going_count || event.interested_count) ? (
                        <div className="flex items-center gap-2 text-neutral">
                          <Users className="h-4 w-4 text-primary/60" />
                          <span className="text-sm">
                            {(event.going_count || 0) + (event.interested_count || 0)} going
                          </span>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      
                      {/* Only show join button for authenticated users */}
                      {isAuthenticated && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/20 text-primary hover:bg-primary/5"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/events/${event.id}`);
                          }}
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            };

            return <EventCardContent key={event.id} />;
          })}
        </div>

        {/* View All Button - Consistent styling */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/events')}
            size="lg"
            variant="outline"
            className="border-2 border-primary/20 text-primary hover:bg-primary/5 px-8"
          >
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
};
