
import React from 'react';
import { Event } from '@/types';
import { MasterEventCard } from '@/components/ui/MasterEventCard';

interface UpcomingEventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
  className?: string;
}

export const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({
  event,
  onClick,
  className,
}) => {
  return (
    <MasterEventCard
      event={event}
      onClick={onClick}
      className={className}
      showRsvpButtons={false} // Home page cards don't show RSVP buttons
    />
  );
};
