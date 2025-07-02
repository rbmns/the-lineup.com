
import { MapPin } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { EventMap } from '@/components/events/EventMap';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Venue {
  name?: string;
  street?: string;
  city?: string;
  postal_code?: string;
}

interface EventLocationSectionProps {
  venue?: Venue | null;
  location?: string;
  destination?: string;
  coordinates?: Coordinates | null;
  title?: string;
}

export const EventLocationSection = ({
  venue,
  location,
  destination,
  coordinates,
  title
}: EventLocationSectionProps) => {
  if (!venue && !location && !destination && !coordinates) return null;
  
  // Determine what to display - prioritize venue info if available, then fall back to event location
  const displayName = venue?.name || 'Event Location';
  const displayAddress = venue ? 
    [venue.street, venue.city, venue.postal_code].filter(Boolean).join(', ') : 
    location || destination || 'Location details not provided';
  
  return (
    <div>
      <div className="flex items-start space-x-2 mb-4">
        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
        <div>
          <p className="font-medium">{displayName}</p>
          <p className="text-sm text-gray-600">{displayAddress}</p>
        </div>
      </div>
      
      {coordinates && (
        <div className="mt-4 rounded-xl overflow-hidden border h-[300px]">
          <AspectRatio ratio={16/9} className="h-full">
            <EventMap 
              latitude={coordinates.latitude} 
              longitude={coordinates.longitude}
              name={venue?.name || title || 'Event Location'}
            />
          </AspectRatio>
        </div>
      )}
    </div>
  );
};
