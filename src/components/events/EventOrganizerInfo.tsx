
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface EventOrganizerInfoProps {
  event: Event;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const EventOrganizerInfo: React.FC<EventOrganizerInfoProps> = ({
  event,
  compact = false,
  className = "",
  style
}) => {
  // Don't render anything if no organizer link
  if (!event.organizer_link) {
    return null;
  }
  
  const organizerName = event.organizer_link
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '');
  
  // Card classes based on compact mode
  const cardClasses = compact 
    ? "shadow-sm border border-gray-200" 
    : "shadow-md border border-gray-200";

  return (
    <Card className={`overflow-hidden ${cardClasses} ${className}`} style={style}>
      <CardContent className={compact ? "p-3" : "p-5"}>
        <h3 className={`font-medium ${compact ? "text-base mb-2" : "text-lg mb-3"}`}>
          Organizer
        </h3>
        
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-600 flex-shrink-0" />
          <div>
            <a 
              href={event.organizer_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {organizerName}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
