
import React, { useState } from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimisticRsvp } from '@/hooks/event-rsvp/useOptimisticRsvp';
import { useEventInteractions } from '@/hooks/events/useEventInteractions';
import { formatInTimeZone } from 'date-fns-tz';
import { AMSTERDAM_TIMEZONE } from '@/utils/dateUtils';

interface RelatedEventCardProps {
  event: Event;
  isSameType?: boolean;
}

export const RelatedEventCard: React.FC<RelatedEventCardProps> = ({ 
  event,
  isSameType = false
}) => {
  const { user, isAuthenticated } = useAuth();
  const { handleRsvp, loadingEventId } = useOptimisticRsvp(user?.id);
  const { handleEventClick } = useEventInteractions();
  const [localRsvpStatus, setLocalRsvpStatus] = useState<'Going' | 'Interested' | undefined>(event.rsvp_status);
  
  // Format event date and time according to requirements
  const formatEventDateTime = (event: Event) => {
    if (!event.start_date) return { date: '', time: '' };
    
    try {
      // Convert start_date to a Date object
      const startDate = new Date(event.start_date);
      
      // Format the date part as "day, date, month" - e.g., "Mon, 15 May"
      const formattedDate = formatInTimeZone(startDate, AMSTERDAM_TIMEZONE, "EEE, d MMM");
      
      // Format the time part (without seconds)
      let timeStr = '';
      if (event.start_time) {
        // Remove seconds if present
        const startTime = event.start_time.split(':').slice(0, 2).join(':');
        
        if (event.end_time) {
          // If we have end time, format as a range (also without seconds)
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
  
  // Get formatted date and time
  const eventDateTime = formatEventDateTime(event);
  
  // RSVP handler with optimistic UI updates
  const handleRsvpAction = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!user?.id || loadingEventId) return false;
    
    console.log('RelatedEventCard - Handling RSVP:', { 
      eventId, 
      status, 
      currentStatus: localRsvpStatus 
    });
    
    try {
      // Optimistically update the UI
      const newStatus = localRsvpStatus === status ? undefined : status;
      setLocalRsvpStatus(newStatus);
      
      // Apply visual feedback animation
      const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
      if (eventCard) {
        if (status === 'Going') {
          eventCard.classList.add('rsvp-going-animation');
          setTimeout(() => eventCard.classList.remove('rsvp-going-animation'), 300);
        } else {
          eventCard.classList.add('rsvp-interested-animation');
          setTimeout(() => eventCard.classList.remove('rsvp-interested-animation'), 300);
        }
      }
      
      // Apply the RSVP using our optimistic handler
      const success = await handleRsvp(eventId, status);
      
      // If the RSVP failed, revert the optimistic update
      if (!success) {
        setLocalRsvpStatus(event.rsvp_status);
      }
      
      return success;
    } catch (error) {
      console.error('RelatedEventCard - RSVP error:', error);
      // Revert optimistic update on error
      setLocalRsvpStatus(event.rsvp_status);
      return false;
    }
  };

  // Create a modified event with the formatted date/time
  const eventWithFormattedDateTime = {
    ...event,
    formattedDate: eventDateTime.date || '',
    formattedTime: eventDateTime.time || '',
    rsvp_status: localRsvpStatus // Use the local state for RSVP status
  };

  return (
    <div 
      className="h-full transition-all duration-300 hover:scale-[1.01] relative" 
      data-testid={`related-event-${event.id}`}
      data-event-id={event.id}
    >
      <EventCard
        event={eventWithFormattedDateTime}
        showRsvpButtons={isAuthenticated}
        compact={true}
        className="h-full border hover:shadow-md transition-all duration-300"
        onClick={() => handleEventClick(event)}
        onRsvp={isAuthenticated ? handleRsvpAction : undefined}
        loadingEventId={loadingEventId}
      />
    </div>
  );
};

export default RelatedEventCard;
