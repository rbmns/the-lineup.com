
import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Venue } from '@/types';

interface EventVenueInfoProps {
  venue: Venue | null;
  location?: string;
  className?: string;
  iconClassName?: string;
  showLinks?: boolean;
}

export const EventVenueInfo: React.FC<EventVenueInfoProps> = ({ 
  venue,
  location,
  className = "",
  iconClassName = "",
  showLinks = true
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
    <div className={`flex items-start gap-3 ${className}`}>
      <MapPin className={`flex-shrink-0 mt-1 text-gray-500 h-5 w-5 ${iconClassName}`} />
      <div className="flex flex-col flex-1">
        <span className="font-medium text-gray-900 font-inter text-base">{venueName}</span>
        
        {venueAddress && (
          <span className="text-gray-600 font-inter text-sm mt-1">
            {venueAddress}
          </span>
        )}
        
        {showLinks && venue && (venue.website || venue.google_maps) && (
          <div className="flex gap-4 mt-2">
            {venue.website && (
              <a
                href={venue.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-inter flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Website
              </a>
            )}
            {venue.google_maps && (
              <a
                href={venue.google_maps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-inter flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                View on Maps
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
