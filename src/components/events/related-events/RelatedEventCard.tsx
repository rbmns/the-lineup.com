
import React, { useState } from 'react';
import { Event } from '@/types';
import { EventCard } from '@/components/EventCard';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimisticRsvp } from '@/hooks/event-rsvp/useOptimisticRsvp';
import { formatInTimeZone } from 'date-fns-tz';
import { AMSTERDAM_TIMEZONE } from '@/utils/dateUtils';

interface RelatedEventCardProps {
  event: Event;
  onClick?: () => void;
}

export const RelatedEventCard: React.FC<RelatedEventCardProps> = ({ 
  event,
  onClick
}) => {
  const { user, isAuthenticated } = useAuth();
  const { handleRsvp, loadingEventId } = useOptimisticRsvp(user?.id);
  const [localRsvpStatus, setLocalRsvpStatus] = useState<'Going' | 'Interested' | null>(event.rsvp_status || null);
  
  const formatEventDateTime = (event: Event) => {
    if (!event.start_date) return { date: '', time: '' };
    
    try {
      const startDate = new Date(event.start_date);
      const formattedDate = formatInTimeZone(startDate, AMSTERDAM_TIMEZONE, "EEE, d MMM");
      
      let timeStr = '';
      if (event.start_time) {
        const startTime = event.start_time.split(':').slice(0, 2).join(':');
        
        if (event.end_time) {
          const endTime = event.end_time.split(':').slice(0, 2).join(':');
          timeStr = `${startTime} - ${endTime}`;
        } else {
          timeStr = startTime;
        }
      }
      
      return {
        date: formattedDate,
        time: timeStr
      };
    } catch (error) {
      console.error('Error formatting event date/time:', error);
      return { date: '', time: '' };
    }
  };
  
  const eventDateTime = formatEventDateTime(event);
  
  const handleRsvpAction = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!user?.id || loadingEventId) return false;
    
    try {
      const newStatus = localRsvpStatus === status ? null : status;
      setLocalRsvpStatus(newStatus);
      
      // Apply visual feedback animation using design system classes
      const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
      if (eventCard) {
        if (status === 'Going') {
          eventCard.classList.add('animate-scale-in');
          setTimeout(() => eventCard.classList.remove('animate-scale-in'), 300);
        } else {
          eventCard.classList.add('animate-fade-in');
          setTimeout(() => eventCard.classList.remove('animate-fade-in'), 300);
        }
      }
      
      const success = await handleRsvp(eventId, status);
      
      if (!success) {
        setLocalRsvpStatus(event.rsvp_status || null);
      }
      
      return success;
    } catch (error) {
      console.error('RelatedEventCard - RSVP error:', error);
      setLocalRsvpStatus(event.rsvp_status || null);
      return false;
    }
  };

  const eventWithFormattedDateTime = {
    ...event,
    formattedDate: eventDateTime.date || '',
    formattedTime: eventDateTime.time || '',
    rsvp_status: localRsvpStatus
  };

  return (
    <div 
      className="h-full transition-smooth hover-scale relative" 
      data-testid={`related-event-${event.id}`}
      data-event-id={event.id}
    >
      <EventCard
        event={eventWithFormattedDateTime}
        showRsvpButtons={isAuthenticated}
        compact={true}
        className="h-full card-base"
        onClick={onClick || undefined}
        onRsvp={isAuthenticated ? handleRsvpAction : undefined}
        loadingEventId={loadingEventId}
      />
    </div>
  );
};

export default RelatedEventCard;
