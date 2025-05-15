
import React, { useState } from 'react';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimisticRsvp } from '@/hooks/event-rsvp/useOptimisticRsvp';
import { useEventInteractions } from '@/hooks/events/useEventInteractions';

interface RelatedEventCardProps {
  event: Event;
}

export const RelatedEventCard: React.FC<RelatedEventCardProps> = ({ event }) => {
  const { user, isAuthenticated } = useAuth();
  const { handleRsvp, loading: rsvpLoading } = useOptimisticRsvp(user?.id); 
  const { handleEventClick } = useEventInteractions();
  const [localRsvpStatus, setLocalRsvpStatus] = useState<'Going' | 'Interested' | undefined>(event.rsvp_status);
  
  // Format event time to ensure it's displayed as HH:mm without seconds
  const formatEventTime = (event: Event) => {
    if (!event.start_time) return '';
    
    let startTime = event.start_time;
    // If start_time has seconds (HH:MM:SS format), remove them
    if (startTime.includes(':') && startTime.split(':').length > 2) {
      const [hours, minutes] = startTime.split(':');
      startTime = `${hours}:${minutes}`;
    }
    
    let timeStr = startTime;
    
    // If we also have end_time, format it as a range
    if (event.end_time) {
      let endTime = event.end_time;
      // If end_time has seconds, remove them
      if (endTime.includes(':') && endTime.split(':').length > 2) {
        const [hours, minutes] = endTime.split(':');
        endTime = `${hours}:${minutes}`;
      }
      timeStr = `${startTime} - ${endTime}`;
    }
    
    return timeStr;
  };
  
  // Create a modified event with the formatted time
  const eventWithFormattedTime = {
    ...event,
    formattedTime: formatEventTime(event)
  };
  
  // RSVP handler with optimistic UI updates
  const handleRsvpAction = async (eventId: string, status: 'Going' | 'Interested') => {
    if (!user?.id || rsvpLoading) return false;
    
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

  return (
    <div 
      className="h-full transition-all duration-300 hover:scale-[1.01]" 
      data-testid={`related-event-${event.id}`}
      data-event-id={event.id}
    >
      <EventCard
        event={{
          ...event,
          rsvp_status: localRsvpStatus // Use the local state for RSVP status
        }} 
        showRsvpButtons={isAuthenticated}
        compact={true}
        className="h-full border hover:shadow-md transition-all duration-300"
        onClick={() => handleEventClick(event)}
        onRsvp={isAuthenticated ? handleRsvpAction : undefined}
      />
    </div>
  );
};

export default RelatedEventCard;
