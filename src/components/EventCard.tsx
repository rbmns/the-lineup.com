
import React from 'react';
import { Event } from '@/types';
import { MasterEventCard } from '@/components/ui/MasterEventCard';

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

export const EventCard: React.FC<EventCardProps> = (props) => {
  return <MasterEventCard {...props} />;
};
