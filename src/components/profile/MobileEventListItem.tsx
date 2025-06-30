
import React from 'react';
import { Event } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { CategoryPill } from '@/components/ui/category-pill';
import { formatEventDateTime } from '@/utils/timezone-utils';
import { Card } from '@/components/ui/card';

interface MobileEventListItemProps {
  event: Event;
  showRsvpStatus?: boolean;
  className?: string;
  onClick?: (event: Event) => void;
}

const MobileEventListItem: React.FC<MobileEventListItemProps> = ({
  event,
  showRsvpStatus = false,
  className,
  onClick,
}) => {
  const { navigateToEvent } = useEventNavigation();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(event);
      return;
    }
    
    try {
      navigateToEvent(event);
    } catch (error) {
      console.error("Error navigating to event:", error);
    }
  };

  const getVenueDisplay = (): string => {
    if (event.venues?.name) {
      return event.venues.name;
    }
    
    if (event.location) {
      return event.location;
    }
    
    return 'Location TBD';
  };

  const getRsvpStatusDisplay = () => {
    if (!showRsvpStatus || !event.rsvp_status) return null;
    
    const status = event.rsvp_status.toLowerCase();
    const statusColor = status === 'going' ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' : 'bg-[#00B4DB]/10 text-[#00B4DB]';
    
    return (
      <span className={cn('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', statusColor)}>
        {event.rsvp_status}
      </span>
    );
  };

  // Use the unified datetime formatting function
  const eventDateTime = formatEventDateTime({
    start_datetime: event.start_datetime,
    start_date: event.start_date || undefined,
    start_time: event.start_time || undefined,
    timezone: event.timezone
  });

  return (
    <Card 
      className={cn(
        "p-3 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 bg-white",
        className
      )}
      onClick={handleClick}
    >
      <div className="space-y-2">
        {/* Title and Category */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[#005F73] text-sm leading-tight line-clamp-2 flex-1">
            {event.title}
          </h3>
          {event.event_category && (
            <CategoryPill 
              category={event.event_category} 
              size="xs"
              showIcon={false}
              className="bg-white border border-gray-200"
            />
          )}
        </div>
        
        {/* Date and Time */}
        <div className="flex items-center gap-2 text-xs text-[#005F73]/80">
          <Calendar className="h-3 w-3 text-[#2A9D8F] flex-shrink-0" />
          <span className="font-medium">
            {eventDateTime.dateTime}
          </span>
        </div>
        
        {/* Location and RSVP Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-[#005F73]/80 flex-1 min-w-0">
            <MapPin className="h-3 w-3 text-[#2A9D8F] flex-shrink-0" />
            <span className="font-medium truncate">
              {getVenueDisplay()}
            </span>
          </div>
          {getRsvpStatusDisplay()}
        </div>
      </div>
    </Card>
  );
};

export default MobileEventListItem;
