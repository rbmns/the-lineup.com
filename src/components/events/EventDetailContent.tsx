import { useMemo } from 'react';
import { Event } from '@/types';
import {
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { EventMap } from '@/components/events/EventMap';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { formatInTimeZone } from 'date-fns-tz';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import '@/styles/rsvp-animations.css';

const AMSTERDAM_TIMEZONE = 'Europe/Amsterdam';

interface EventDetailContentProps {
  event: Event;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean>;
  isRsvpLoading?: boolean;
  isOwner?: boolean;
}

export const EventDetailContent: React.FC<EventDetailContentProps> = ({
  event,
  onRsvp,
  isRsvpLoading = false,
  isOwner = false,
}) => {
  // Format date for detail view
  const formattedDate = useMemo(() => {
    if (!event.start_time) return '';
    
    try {
      const date = new Date(event.start_time);
      return formatInTimeZone(date, AMSTERDAM_TIMEZONE, "EEEE, MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      console.error('Error formatting date:', error);
      return String(event.start_time);
    }
  }, [event.start_time]);
  
  // Format time until event
  const timeUntilEvent = useMemo(() => {
    if (!event.start_time) return '';
    
    try {
      const date = new Date(event.start_time);
      if (date <= new Date()) return 'Event has started';
      return `Starts ${formatDistanceToNow(date, { addSuffix: true })}`;
    } catch (error) {
      console.error('Error calculating time until event:', error);
      return '';
    }
  }, [event.start_time]);
  
  // Format event duration
  const eventDuration = useMemo(() => {
    if (!event.start_time || !event.end_time) return '';
    
    try {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);
      const durationHours = Math.abs(end.getTime() - start.getTime()) / 36e5;
      return `${durationHours.toFixed(1)} hours`;
    } catch (error) {
      console.error('Error calculating event duration:', error);
      return '';
    }
  }, [event.start_time, event.end_time]);
  
  // Process tags for display - with proper type handling
  const eventTags = useMemo(() => {
    try {
      // If tags is undefined or null, return empty array
      if (!event.tags) return [];
      
      // If tags is already an array, return filtered version
      if (Array.isArray(event.tags)) {
        return event.tags.filter(tag => !!tag);
      }
      
      // If tags is a string, split by comma
      if (typeof event.tags === 'string') {
        const tagsString: string = event.tags;
        return tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
      }
      
      // For any other types, log warning and return empty array
      console.warn('Unexpected tags format:', typeof event.tags, event.tags);
      return [];
    } catch (error) {
      console.error('Error processing tags:', error);
      return [];
    }
  }, [event.tags]);
  
  // Safely extract coordinates from different possible formats
  const getEventCoordinates = useMemo(() => {
    if (!event.coordinates) return null;
    
    try {
      // Handle coordinates as an array [longitude, latitude]
      if (Array.isArray(event.coordinates) && event.coordinates.length >= 2) {
        return {
          latitude: Number(event.coordinates[1]),
          longitude: Number(event.coordinates[0])
        };
      }
      
      // Handle coordinates as an object with latitude/longitude properties
      if (typeof event.coordinates === 'object') {
        const coords = event.coordinates as any;
        if ('latitude' in coords && 'longitude' in coords) {
          return {
            latitude: Number(coords.latitude),
            longitude: Number(coords.longitude)
          };
        }
      }
    } catch (err) {
      console.error('Error processing coordinates:', err);
    }
    
    return null;
  }, [event.coordinates]);
  
  // Handle RSVP
  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    try {
      // Log the current RSVP status before handling
      console.log(`EventDetailContent: Current RSVP status before handling: ${event.rsvp_status}, handling: ${status}`);
      
      const result = await onRsvp(event.id, status);
      return result;
    } catch (error) {
      console.error('RSVP error:', error);
      return false;
    }
  };
  
  // Check if we have a booking link
  const bookingLink = event.booking_link || event.organizer_link || null;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
      {/* Event details - takes up 2/3 of the space on desktop */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{event.title}</h1>
          
          {/* Date and time info */}
          <div className="flex items-start space-x-2">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium">{formattedDate}</p>
              <p className="text-sm text-gray-600">{timeUntilEvent}</p>
              {eventDuration && (
                <p className="text-sm text-gray-600">Duration: {eventDuration}</p>
              )}
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Location section */}
        {(event.venue_id || event.location || getEventCoordinates) && (
          <div>
            <div className="flex items-start space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">{event.venues?.name || 'Event Location'}</p>
                <p className="text-sm text-gray-600">
                  {[
                    event.venues?.street,
                    event.venues?.city,
                    event.venues?.postal_code
                  ].filter(Boolean).join(', ') || event.location || 'Location details not provided'}
                </p>
              </div>
            </div>
            
            {getEventCoordinates && (
              <div className="mt-4 rounded-xl overflow-hidden border h-[300px]">
                <AspectRatio ratio={16/9} className="h-full">
                  <EventMap 
                    latitude={getEventCoordinates.latitude} 
                    longitude={getEventCoordinates.longitude}
                    name={event.venues?.name || event.title || 'Event Location'}
                  />
                </AspectRatio>
              </div>
            )}
          </div>
        )}
        
        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold mb-4">About this event</h2>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-line">{event.description}</p>
          </div>
        </div>
        
        {/* Tags */}
        {eventTags.length > 0 && (
          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {eventTags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Sidebar - takes up 1/3 of the space on desktop */}
      <div className="space-y-8">
        {/* RSVP actions */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-4">
            {onRsvp && !isOwner && (
              <>
                <h3 className="font-medium">Are you going?</h3>
                <EventRsvpButtons 
                  currentStatus={event.rsvp_status || null}
                  onRsvp={handleRsvp}
                  isLoading={isRsvpLoading}
                  size="lg"
                  className="w-full"
                />
              </>
            )}
            
            {isOwner && (
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-700">You created this event</p>
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                variant="outline"
                className="w-full flex items-center justify-center gap-2" 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: event.title,
                      text: `Check out this event: ${event.title}`,
                      url: window.location.href
                    }).catch(error => {
                      console.error('Error sharing:', error);
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied to clipboard",
                        description: "You can now paste it anywhere you want."
                      });
                    });
                  } else {
                    // Fallback for browsers that don't support navigator.share
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link copied to clipboard",
                      description: "You can now paste it anywhere you want."
                    });
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
                Share this event
              </Button>
            </div>
          </div>
        </div>
        
        {/* Attendees summary */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <Users className="h-5 w-5" /> 
            <span>Who's coming</span>
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xl font-bold">{event.attendees?.going || 0}</div>
              <div className="text-sm text-gray-600">Going</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{event.attendees?.interested || 0}</div>
              <div className="text-sm text-gray-600">Interested</div>
            </div>
          </div>
        </div>
        
        {/* External link if available */}
        {bookingLink && (
          <div>
            <a 
              href={bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 font-medium flex items-center gap-1.5 hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Visit event website
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
