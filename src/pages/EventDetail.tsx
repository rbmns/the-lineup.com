
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEventById } from '@/lib/eventService';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { formatDate, formatEventTime } from '@/utils/date-formatting';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link to="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const eventLocation = event.venues?.name ? 
    `${event.venues.name}${event.venues.city ? `, ${event.venues.city}` : ''}` : 
    event.location || 'Location TBD';

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{event.title} | the lineup</title>
        <meta name="description" content={event.description || `Join us for ${event.title}`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>

        {/* Event Header */}
        <div className="mb-8">
          {event.image_urls && event.image_urls.length > 0 && (
            <img 
              src={event.image_urls[0]} 
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {event.start_date && formatDate(event.start_date)}
                {event.start_time && ` • ${formatEventTime(event.start_time, event.end_time)}`}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{eventLocation}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>
                {event.attendees?.going || 0} going, {event.attendees?.interested || 0} interested
              </span>
            </div>
          </div>

          {event.event_category && (
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-6">
              {event.event_category}
            </span>
          )}
        </div>

        {/* Event Description */}
        {event.description && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </div>
        )}

        {/* Additional Info */}
        {event.extra_info && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.extra_info}</p>
          </div>
        )}

        {/* Fee Information */}
        {event.fee && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cost</h2>
            <p className="text-gray-700">€{event.fee}</p>
          </div>
        )}

        {/* Organizer Link */}
        {event.organizer_link && (
          <div className="mb-8">
            <Button asChild>
              <a href={event.organizer_link} target="_blank" rel="noopener noreferrer">
                Get Tickets / More Info
              </a>
            </Button>
          </div>
        )}

        {/* Creator Info */}
        {event.creator && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Organized by</h2>
            <div className="flex items-center gap-3">
              {event.creator.avatar_url && event.creator.avatar_url.length > 0 && (
                <img 
                  src={event.creator.avatar_url[0]} 
                  alt={event.creator.username || 'Organizer'}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{event.creator.username}</p>
                {event.creator.tagline && (
                  <p className="text-gray-600 text-sm">{event.creator.tagline}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
