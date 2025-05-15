
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Ticket, Globe, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface BookingInformationProps {
  event: Event;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
}

export const BookingInformation: React.FC<BookingInformationProps> = ({ 
  event, 
  className = '',
  style,
  compact = false,
}) => {
  const hasFee = typeof event.fee === 'number' && event.fee > 0;
  const hasBookingLink = !!event.booking_link;
  const hasExtraInfo = !!event.extra_info && event.extra_info.trim() !== '';
  const hasOrganizerLink = !!event.organizer_link;
  
  // Don't render the component if there's no relevant information
  if (!hasFee && !hasBookingLink && !hasExtraInfo && !hasOrganizerLink) {
    return null;
  }
  
  return (
    <Card className={`border shadow-sm ${className}`} style={style}>
      <CardContent className={`${compact ? 'p-4' : 'p-5'}`}>
        <h3 className="text-md font-semibold mb-3">Booking Info</h3>
        
        <div className="space-y-4">
          {hasFee && (
            <div className="flex items-start gap-2">
              <Ticket className="h-4 w-4 text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Entry fee</p>
                <p className="text-sm">{typeof event.fee === 'number' ? `€${event.fee.toFixed(2)}` : 'Free'}</p>
              </div>
            </div>
          )}
          
          {hasBookingLink && (
            <div className="flex items-start gap-2">
              <CalendarClock className="h-4 w-4 text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Booking required</p>
                <a 
                  href={event.booking_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block"
                >
                  Book Now
                </a>
              </div>
            </div>
          )}
          
          {hasOrganizerLink && (
            <div className="flex items-start gap-2">
              <Globe className="h-4 w-4 text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Organizer website</p>
                <a 
                  href={event.organizer_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block"
                >
                  {new URL(event.organizer_link).hostname.replace('www.', '')}
                </a>
              </div>
            </div>
          )}
          
          {hasExtraInfo && (
            <>
              {(hasFee || hasBookingLink || hasOrganizerLink) && <Separator className="my-2" />}
              <div>
                <p className="text-sm font-medium mb-1">Additional information</p>
                <p className="text-sm text-gray-600">{event.extra_info}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingInformation;
