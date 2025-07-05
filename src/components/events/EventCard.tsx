
import React from 'react';
import { Event } from '@/types';
import { MasterEventCard } from '@/components/ui/MasterEventCard';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { useAuth } from '@/contexts/AuthContext';

interface EventCardProps {
  event: Event;
  compact?: boolean;
  showRsvpButtons?: boolean;
  showRsvpStatus?: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  className?: string;
  onClick?: (event: Event) => void;
  loadingEventId?: string | null;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  compact = false,
  showRsvpButtons = true,
  showRsvpStatus = false,
  onRsvp,
  className,
  onClick,
  loadingEventId,
}) => {
  const { isAuthenticated } = useAuth();
  const shouldShowRsvp = isAuthenticated && showRsvpButtons;

  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp || !shouldShowRsvp) return false;
    
    try {
      const result = await onRsvp(event.id, status);
      return result === undefined ? true : !!result;
    } catch (error) {
      console.error('Error in EventCard RSVP handler:', error);
      return false;
    }
  };

  return (
    <MasterEventCard
      event={event}
      compact={compact}
      showRsvpButtons={false} // We'll handle RSVP via children
      className={className}
      onClick={onClick}
      loadingEventId={loadingEventId}
    >
      {shouldShowRsvp && onRsvp && (
        <EventRsvpButtons
          currentStatus={event.rsvp_status}
          onRsvp={handleRsvp}
          isLoading={loadingEventId === event.id}
          className="w-full"
          size="default"
        />
      )}
    </MasterEventCard>
  );
};
