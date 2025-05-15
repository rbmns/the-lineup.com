
import React from 'react';
import { Venue } from '@/types';
import { MapPin } from 'lucide-react';

interface EventLocationInfoProps {
  venue: Venue | null;
}

export const EventLocationInfo: React.FC<EventLocationInfoProps> = ({ venue }) => {
  if (!venue) {
    return (
      <div className="text-gray-500 italic">No location information available</div>
    );
  }

  const formattedAddress = [
    venue.street,
    venue.postal_code,
    venue.city
  ].filter(Boolean).join(', ');

  const googleMapsUrl = venue.google_maps || 
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${venue.name} ${formattedAddress}`
    )}`;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <MapPin className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-base">{venue.name}</h4>
          <p className="text-gray-600">{formattedAddress}</p>
        </div>
      </div>
      
      <div className="pt-2">
        <a 
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
        >
          View on map
        </a>
      </div>
    </div>
  );
};

export default EventLocationInfo;
