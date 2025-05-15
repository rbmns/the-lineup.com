
import React from 'react';
import { Venue } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventLocationInfoProps {
  venue?: Venue | null;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const EventLocationInfo: React.FC<EventLocationInfoProps> = ({
  venue,
  compact = false,
  className = "",
  style
}) => {
  // Don't render anything if no venue data
  if (!venue) {
    return null;
  }
  
  // Extract venue details
  const { name, street, city, region, slug } = venue;
  const hasAddress = !!street;
  const hasName = !!name;
  
  // Skip rendering if no useful information
  if (!hasName && !hasAddress && !city) {
    return null;
  }
  
  // Create Google Maps URL for directions
  const getMapsUrl = () => {
    let query = '';
    
    if (name) {
      query += encodeURIComponent(name);
    }
    
    if (street) {
      if (query) query += ', ';
      query += encodeURIComponent(street);
    }
    
    if (city) {
      if (query) query += ', ';
      query += encodeURIComponent(city);
    }
    
    if (region) {
      if (query) query += ', ';
      query += encodeURIComponent(region);
    }
    
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  // Card classes based on compact mode
  const cardClasses = compact 
    ? "shadow-sm border border-gray-200" 
    : "shadow-md border border-gray-200";

  // Render venue name as link if slug is available
  const renderVenueName = () => {
    if (!hasName) return null;
    
    if (slug) {
      return (
        <Link 
          to={`/venues/${slug}`}
          className="text-gray-900 font-medium hover:text-blue-600 hover:underline"
        >
          {name}
        </Link>
      );
    }
    
    return <div className="text-gray-900 font-medium">{name}</div>;
  };

  return (
    <Card className={`overflow-hidden ${cardClasses} ${className}`} style={style}>
      <CardContent className={compact ? "p-3" : "p-5"}>
        <h3 className={`font-medium ${compact ? "text-base mb-2" : "text-lg mb-3"}`}>
          Location
        </h3>
        
        <div className="space-y-2">
          {/* Venue name */}
          {hasName && (
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 mt-0.5 text-gray-600 flex-shrink-0" />
              <div>
                {renderVenueName()}
                {hasAddress && (
                  <div className="text-gray-600 text-sm">{street}</div>
                )}
                {(city || region) && (
                  <div className="text-gray-600 text-sm">
                    {[city, region].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Just address if no venue name */}
          {!hasName && hasAddress && (
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-600 flex-shrink-0" />
              <div className="text-gray-700">
                {street}
                {(city || region) && (
                  <span className="block">
                    {[city, region].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Map link */}
        {(hasName || hasAddress || city) && (
          <div className={compact ? "mt-2" : "mt-3"}>
            <a 
              href={getMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline mt-2"
            >
              <Map className="h-4 w-4" />
              View on map
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
