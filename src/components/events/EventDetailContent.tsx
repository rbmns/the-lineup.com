
import React, { useMemo, useCallback } from 'react';
import { Event } from '@/types';
import { Separator } from '@/components/ui/separator';
import '@/styles/rsvp-animations.css';
import { EventDateTimeSection } from './detail-sections/EventDateTimeSection';
import { EventLocationSection } from './detail-sections/EventLocationSection';
import { EventDescriptionSection } from './detail-sections/EventDescriptionSection';
import { EventTagsSection } from './detail-sections/EventTagsSection';
import { EventRsvpSection } from './detail-sections/EventRsvpSection';
import { EventAttendeesSummary } from './detail-sections/EventAttendeesSummary';
import { EventExternalLink } from './detail-sections/EventExternalLink';
import { EventFriendRsvps } from './EventFriendRsvps';
import { extractEventCoordinates } from './detail-sections/EventCoordinatesExtractor';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock, Euro, ExternalLink, Users } from 'lucide-react';
import { formatDate, formatEventTime } from '@/utils/date-formatting';
import { CategoryPill } from '@/components/ui/category-pill';
import { useEventImages } from '@/hooks/useEventImages';
import { LineupImage } from '@/components/ui/lineup-image';

interface EventDetailContentProps {
  event: Event;
  attendees?: { going: any[]; interested: any[] };
  friendAttendees?: { going: any[]; interested: any[] };
  relatedEvents?: Event[];
  relatedLoading?: boolean;
  isAuthenticated?: boolean;
  rsvpLoading?: boolean;
  onRsvp?: (status: 'Going' | 'Interested') => Promise<boolean>;
  isRsvpLoading?: boolean;
  isOwner?: boolean;
}

const EventDetailContent = ({
  event,
  attendees,
  friendAttendees,
  onRsvp,
  isRsvpLoading = false,
  rsvpLoading = false,
  isOwner = false,
}: EventDetailContentProps) => {
  const { getEventImageUrl } = useEventImages();
  
  // Get coordinates in a standardized format - memoized
  const coordinates = useMemo(() => 
    extractEventCoordinates(event.coordinates), 
    [event.coordinates]
  );
  
  // Check if we have a booking link - memoized
  const bookingLink = useMemo(() => 
    event.booking_link || event.organizer_link || null, 
    [event.booking_link, event.organizer_link]
  );
  
  // Handle RSVP - memoized callback
  const handleRsvp = useCallback(async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    try {
      console.log(`EventDetailContent: Current RSVP status before handling: ${event.rsvp_status}, handling: ${status}`);
      
      const result = await onRsvp(status);
      return result;
    } catch (error) {
      console.error('RSVP error:', error);
      return false;
    }
  }, [onRsvp, event.rsvp_status]);

  // Format event location with improved venue handling
  const eventLocation = useMemo(() => {
    if (event.venues?.name) {
      return event.venues.name;
    }
    return event.location || 'Location TBD';
  }, [event.venues, event.location]);

  // Get full venue address for display
  const getVenueAddress = () => {
    if (!event.venues) return null;
    
    const addressParts = [
      event.venues.street,
      event.venues.postal_code,
      event.venues.city
    ].filter(Boolean);
    
    return addressParts.length > 0 ? addressParts.join(', ') : null;
  };

  // Generate Google Maps URL for the venue - FIXED VERSION
  const getMapUrl = () => {
    // First priority: use the venue's direct Google Maps URL if available
    if (event.venues?.google_maps) {
      console.log('Using venue Google Maps URL:', event.venues.google_maps);
      return event.venues.google_maps;
    }
    
    // Second priority: create a search URL from venue details
    if (event.venues) {
      const searchQuery = [
        event.venues.name,
        event.venues.street,
        event.venues.city,
        event.venues.postal_code
      ].filter(Boolean).join(', ');
      
      if (searchQuery) {
        const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
        console.log('Generated Google Maps search URL:', searchUrl);
        return searchUrl;
      }
    }
    
    // Fallback: use event location if available
    if (event.location) {
      const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
      console.log('Using fallback location URL:', fallbackUrl);
      return fallbackUrl;
    }
    
    console.log('No location data available for Google Maps');
    return null;
  };
  
  const imageUrl = getEventImageUrl(event);
  const venueAddress = getVenueAddress();
  const mapUrl = getMapUrl();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Full width */}
      <div className="relative w-full">
        <LineupImage
          src={imageUrl}
          alt={event.title}
          aspectRatio="hero"
          overlayVariant="sunset"
          className="w-full h-72 sm:h-80 lg:h-[32rem]"
          loading="eager"
        />
        
        {/* Category pill on top of image */}
        {event.event_category && (
          <div className="absolute top-6 left-6 z-30">
            <CategoryPill 
              category={event.event_category}
              size="lg"
              showIcon={true}
            />       
          </div>
        )}
        
        {/* Hero content overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-inter font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
              {event.title}
            </h1>
            <div className="flex items-center text-white/90 text-xl">
              <Calendar className="h-6 w-6 mr-4" />
              <span>
                {event.start_date && formatDate(event.start_date)}
                {event.start_time && ` • ${formatEventTime(event.start_time, event.end_time)}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 lg:px-16 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* RSVP Section */}
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-8 lg:p-10">
                  <EventRsvpSection 
                    isOwner={isOwner}
                    onRsvp={handleRsvp}
                    isRsvpLoading={isRsvpLoading || rsvpLoading}
                    currentStatus={event.rsvp_status || null}
                  />
                </CardContent>
              </Card>
              
              {/* About Section */}
              {event.description && (
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-8 lg:p-10">
                    <h2 className="font-inter font-semibold text-2xl lg:text-3xl text-gray-900 mb-8">About this event</h2>
                    <div className="prose prose-gray prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg lg:text-xl">
                        {event.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-8 lg:p-10">
                    <EventTagsSection tags={event.tags} />
                  </CardContent>
                </Card>
              )}
              
              {/* Friends attending section */}
              {friendAttendees && (friendAttendees.going.length > 0 || friendAttendees.interested.length > 0) && (
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-8 lg:p-10">
                    <h3 className="font-inter font-semibold text-xl text-gray-900 mb-8">Friends Attending</h3>
                    <EventFriendRsvps 
                      going={friendAttendees.going}
                      interested={friendAttendees.interested}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Right Column - Event Details Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Event Details Card */}
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="font-inter font-semibold text-xl text-gray-900 mb-8">Event Details</h3>
                  
                  <div className="space-y-8">
                    {/* Date & Time */}
                    <div className="flex items-start gap-4">
                      <Calendar className="h-6 w-6 text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 mb-2 text-lg">Date</p>
                        <p className="text-gray-600">
                          {event.start_date && formatDate(event.start_date)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Time */}
                    {event.start_time && (
                      <div className="flex items-start gap-4">
                        <Clock className="h-6 w-6 text-gray-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 mb-2 text-lg">Time</p>
                          <p className="text-gray-600">
                            {formatEventTime(event.start_time, event.end_time)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Venue */}
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-gray-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2 text-lg">Venue</p>
                        <p className="text-gray-600 mb-2">{eventLocation}</p>
                        {venueAddress && (
                          <p className="text-sm text-gray-500 mb-4">{venueAddress}</p>
                        )}
                        
                        {/* Venue links */}
                        <div className="flex flex-col gap-3">
                          {event.venues?.website && (
                            <a
                              href={event.venues.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Website
                            </a>
                          )}
                          {mapUrl && (
                            <a
                              href={mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View on Maps
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Entrance Fee */}
                    {event.fee && (
                      <div className="flex items-start gap-4">
                        <Euro className="h-6 w-6 text-gray-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 mb-2 text-lg">Entrance Fee</p>
                          <p className="text-gray-600">€{event.fee}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Attendees Summary */}
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="h-6 w-6 text-gray-500" />
                    <h3 className="font-inter font-semibold text-xl text-gray-900">Attendees</h3>
                  </div>
                  <EventAttendeesSummary 
                    goingCount={attendees?.going?.length || event.attendees?.going || 0}
                    interestedCount={attendees?.interested?.length || event.attendees?.interested || 0}
                  />
                </CardContent>
              </Card>
              
              {/* External link if available */}
              {bookingLink && (
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-8">
                    <EventExternalLink url={bookingLink} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export const MemoizedEventDetailContent = React.memo(EventDetailContent);

// For backward compatibility, export the component as before
export { MemoizedEventDetailContent as EventDetailContent };
