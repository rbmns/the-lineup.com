
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
  coordinates?: Coordinates | null;
  title?: string;
}

export const EventLocationSection = ({
  venue,
  location,
  coordinates,
  title
}: EventLocationSectionProps) => {
  if (!venue && !location && !coordinates) return null;
  
  return (
    <div>
      <div className="flex items-start space-x-2 mb-4">
        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
        <div>
          <p className="font-medium">{venue?.name || 'Event Location'}</p>
          <p className="text-sm text-gray-600">
            {[
              venue?.street,
              venue?.city,
              venue?.postal_code
            ].filter(Boolean).join(', ') || location || 'Location details not provided'}
          </p>
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
