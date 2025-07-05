
import React from 'react';
import { Event } from '@/types';
import { MasterEventCard } from '@/components/ui/MasterEventCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useEventNavigation } from '@/hooks/useEventNavigation';

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
  const { navigateToEvent } = useEventNavigation();

  const handleRsvpNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigateToEvent(event);
  };

  return (
    <MasterEventCard
      event={event}
      compact={compact}
      showRsvpButtons={false}
      showRsvpStatus={showRsvpStatus}
      className={className}
      onClick={onClick}
      loadingEventId={loadingEventId}
    >
      {isAuthenticated && (
        <Button
          onClick={handleRsvpNavigate}
          className="w-full bg-ocean-teal hover:bg-ocean-teal/90 text-white"
          size="default"
          data-rsvp-button="true"
        >
          RSVP
        </Button>
      )}
    </MasterEventCard>
  );
};
