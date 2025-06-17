
import React from 'react';
import { MapPin } from 'lucide-react';
import { Venue } from '@/types';

interface EventVenueInfoProps {
  venue: Venue | null;
  location?: string;
  className?: string;
  iconClassName?: string;
}

export const EventVenueInfo: React.FC<EventVenueInfoProps> = ({ 
  venue,
  location,
  className = "",
  iconClassName = ""
}) => {
  // Get the display name for the venue
  const getVenueDisplayName = (): string => {
    if (venue?.name) return venue.name;
    if (location) return location;
    return 'Venue TBD';
  };

  // Get the address information
  const getVenueAddress = (): string | null => {
    if (!venue) return null;
    
    const addressParts = [
      venue.street,
      venue.postal_code,
      venue.city
    ].filter(Boolean);
    
    return addressParts.length > 0 ? addressParts.join(', ') : null;
  };

  const venueName = getVenueDisplayName();
  const venueAddress = getVenueAddress();

  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <MapPin className={`flex-shrink-0 mt-1 text-gray-500 ${iconClassName}`} />
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 font-inter">{venueName}</span>
        
        {venueAddress && (
          <span className="text-gray-600 font-inter text-sm">
            {venueAddress}
          </span>
        )}
        
        {venue && (venue.website || venue.google_maps) && (
          <div className="flex gap-4 mt-1">
            {venue.website && (
              <a
                href={venue.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-inter"
              >
                Website
              </a>
            )}
            {venue.google_maps && (
              <a
                href={venue.google_maps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-inter"
              >
                Maps
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
