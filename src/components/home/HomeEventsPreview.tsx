
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

interface HomeEventsPreviewProps {
  events: Event[] | undefined;
  isLoading: boolean;
}

export const HomeEventsPreview: React.FC<HomeEventsPreviewProps> = ({
  events,
  isLoading
}) => {
  const navigate = useNavigate();

  const displayEvents = events?.slice(0, 6) || [];

  if (isLoading) {
    return (
      <section className="py-16 bg-secondary-25">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Upcoming Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary-25">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Upcoming Events</h2>
          <p className="text-lg text-neutral max-w-2xl mx-auto">
            Join others in experiences that match your interests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayEvents.map((event) => (
            <div 
              key={event.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-100"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              {/* Event Title */}
              <h3 className="font-semibold text-primary text-lg mb-3 line-clamp-2">
                {event.title}
              </h3>

              {/* Date & Time */}
              <div className="flex items-center gap-2 text-neutral mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {event.start_date ? format(new Date(event.start_date), 'MMM d') : 'TBD'}
                  {event.start_time && ` at ${event.start_time.substring(0, 5)}`}
                </span>
              </div>

              {/* Location */}
              {(event.venues?.name || event.location) && (
                <div className="flex items-center gap-2 text-neutral mb-3">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm truncate">
                    {event.venues?.name || event.location}
                  </span>
                </div>
              )}

              {/* Vibe/Category */}
              {event.event_category && (
                <div className="inline-block px-3 py-1 bg-vibrant-seafoam/10 text-vibrant-seafoam rounded-full text-xs font-medium mb-3">
                  {event.event_category}
                </div>
              )}

              {/* Attendees */}
              <div className="flex items-center justify-between">
                {(event.going_count || event.interested_count) ? (
                  <div className="flex items-center gap-2 text-neutral">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">
                      {(event.going_count || 0) + (event.interested_count || 0)} going
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-neutral">Be the first to join</span>
                )}
                
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
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
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
