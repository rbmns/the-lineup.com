
import React from 'react';
import { MapPin } from 'lucide-react';
import { Venue } from '@/types';
import { Link } from 'react-router-dom';

interface EventVenueInfoProps {
  venue: Venue | null;
  className?: string;
  iconClassName?: string;
}

export const EventVenueInfo: React.FC<EventVenueInfoProps> = ({ 
  venue,
  className = "",
  iconClassName = ""
}) => {
  if (!venue) {
    return (
      <div className={`flex items-start gap-2 ${className}`}>
        <MapPin className={`flex-shrink-0 mt-1 text-gray-500 ${iconClassName}`} />
        <span className="text-gray-500 italic">No venue information</span>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <MapPin className={`flex-shrink-0 mt-1 text-gray-500 ${iconClassName}`} />
      <div className="flex flex-col">
        {venue.slug ? (
          <Link 
            to={`/venues/${venue.slug}`}
            className="font-medium text-gray-900 font-inter hover:text-blue-600 hover:underline"
          >
            {venue.name}
          </Link>
        ) : (
          <span className="font-medium text-gray-900 font-inter">{venue.name}</span>
        )}
        
        {venue.city && (
          <span className="text-gray-600 font-inter">
            {venue.city}
          </span>
        )}
        {(venue.website || venue.google_maps) && (
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
