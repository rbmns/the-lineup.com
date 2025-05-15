
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Banknote, Link, Users } from 'lucide-react';

interface EventAdditionalInfoProps {
  event: Event;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const EventAdditionalInfo: React.FC<EventAdditionalInfoProps> = ({
  event,
  compact = false,
  className = "",
  style
}) => {
  // Check if we have any additional info to display
  const hasFee = typeof event.fee === 'number';
  const hasBookingLink = !!event.booking_link;
  const hasOrganizerLink = !!event.organizer_link;
  const hasOrganizerName = !!event.organiser_name;
  const hasExtraInfo = !!event.extra_info;
  
  // If no additional info, don't render anything
  if (!hasFee && !hasBookingLink && !hasOrganizerLink && !hasOrganizerName && !hasExtraInfo) {
    return null;
  }
  
  // Card classes based on compact mode
  const cardClasses = compact 
    ? "shadow-sm border border-gray-200" 
    : "shadow-md border border-gray-200";
    
  // Format organizer name or extract from URL if not available
  const getOrganizerName = () => {
    if (hasOrganizerName) return event.organiser_name;
    if (hasOrganizerLink) {
      return event.organizer_link
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '');
    }
    return 'Event Organiser';
  };

  return (
    <Card className={`overflow-hidden ${cardClasses} ${className}`} style={style}>
      <CardContent className={compact ? "p-3" : "p-5"}>
        <h3 className={`font-medium ${compact ? "text-base mb-2" : "text-lg mb-3"}`}>
          Booking Info
        </h3>
        
        {/* Organizer information */}
        {(hasOrganizerLink || hasOrganizerName) && (
          <div className="flex items-start gap-2 mb-2">
            <Users className="h-5 w-5 mt-0.5 text-gray-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-700">Organiser</div>
              {hasOrganizerLink ? (
                <a 
                  href={event.organizer_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {getOrganizerName()}
                </a>
              ) : (
                <span className="text-gray-700">{event.organiser_name}</span>
              )}
            </div>
          </div>
        )}
        
        {/* Fee information */}
        {hasFee && (
          <div className="flex items-start gap-2 mb-2">
            <Banknote className="h-5 w-5 mt-0.5 text-gray-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-700">Entrance Fee</div>
              <div className="text-gray-600">
                €{event.fee} per person
              </div>
            </div>
          </div>
        )}
        
        {/* Booking link */}
        {hasBookingLink && (
          <div className="flex items-start gap-2 mb-2">
            <Link className="h-5 w-5 mt-0.5 text-gray-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-700">Booking</div>
              <a 
                href={event.booking_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Book your spot
              </a>
            </div>
          </div>
        )}
        
        {/* Extra information text */}
        {hasExtraInfo && (
          <div className={hasFee || hasBookingLink || hasOrganizerLink || hasOrganizerName ? "mt-3" : ""}>
            <p className="text-gray-700 whitespace-pre-line text-sm">
              {event.extra_info}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
