import React, { useState } from 'react';
import { EventRsvpButtons } from './EventRsvpButtons';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface EventCardActionsProps {
  eventId: string;
  currentRsvpStatus?: 'Going' | 'Interested';
  showRsvpButtons?: boolean;
  showRsvpStatus?: boolean;
  showFriendRsvp?: boolean;
  friendUsername?: string;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  extraContent?: React.ReactNode;
  compact?: boolean;
  useSmallButtons?: boolean;
}

export const EventCardActions: React.FC<EventCardActionsProps> = ({
  eventId,
  currentRsvpStatus,
  showRsvpButtons = true,
  showRsvpStatus = false,
  showFriendRsvp = false,
  friendUsername,
  onRsvp,
  extraContent,
  compact = false,
  useSmallButtons = false
}) => {
  const [localRsvpStatus, setLocalRsvpStatus] = useState<'Going' | 'Interested' | undefined>(currentRsvpStatus);
  const [isLoading, setIsLoading] = useState(false);

  // If we don't need to show any actions, return null
  if (!showRsvpButtons && !showRsvpStatus && !showFriendRsvp) {
    return null;
  }

  const handleRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    try {
      console.log('EventCardActions - Handling RSVP for event:', eventId, status);
      setIsLoading(true);
      
      // The critical fix: store the specific eventId this action is for
      const thisEventId = eventId;
      
      // Calculate new status - if clicking the same button that's active, toggle it off
      // This ensures only one status can be active at a time
      const newStatus = localRsvpStatus === status ? undefined : status;
      setLocalRsvpStatus(newStatus);
      
      // Add improved visual feedback with animation
      const eventCard = document.querySelector(`[data-event-id="${thisEventId}"]`);
      if (eventCard) {
        // Apply faster animation with less flickering
        eventCard.classList.add('transition-all', 'duration-100');
        
        if (status === 'Going') {
          eventCard.classList.add('rsvp-going-animation');
          setTimeout(() => eventCard.classList.remove('rsvp-going-animation'), 200);
        } else {
          eventCard.classList.add('rsvp-interested-animation');
          setTimeout(() => eventCard.classList.remove('rsvp-interested-animation'), 200);
        }
      }
      
      // Pass the specific eventId to ensure we only update this event
      const result = await onRsvp(thisEventId, status);
      const success = result === undefined ? true : !!result;
      
      // Revert if the operation failed
      if (!success) {
        setLocalRsvpStatus(currentRsvpStatus);
      }
      
      return success;
    } catch (error) {
      console.error('EventCardActions - Error handling RSVP:', error);
      setLocalRsvpStatus(currentRsvpStatus); // Revert on error
      return false;
    } finally {
      setTimeout(() => setIsLoading(false), 100); // Reduced delay for faster feedback
    }
  };

  // Determine the appropriate button size based on compact mode and useSmallButtons prop
  const buttonSize = useSmallButtons ? 'sm' : (compact ? 'sm' : 'default');

  return (
    <div 
      className={cn(
        "event-rsvp-container", 
        "mt-2",
        "transition-all duration-100" // Faster animation
      )}
      data-no-navigation="true"
      data-rsvp-container="true"
      data-event-id={eventId}
      onClick={(e) => e.stopPropagation()}
    >
      {/* RSVP Buttons */}
      {showRsvpButtons && onRsvp && (
        <div 
          className="event-rsvp-buttons animate-fade-in" 
          data-no-navigation="true"
          style={{ animationDuration: '100ms' }}
          onClick={(e) => e.stopPropagation()}
        >
          <EventRsvpButtons
            eventId={eventId}
            currentStatus={localRsvpStatus || null}
            onRsvp={handleRsvp}
            size={buttonSize}
            className="w-full"
            isLoading={isLoading}
          />
        </div>
      )}

      {/* RSVP Status Display (no buttons) */}
      {showRsvpStatus && localRsvpStatus && !onRsvp && (
        <div className="mt-2 animate-fade-in" data-no-navigation="true">
          <Badge
            variant="outline"
            className={cn(
              "py-1 px-3 text-xs font-medium transition-all duration-100", // Faster animation
              localRsvpStatus === 'Going' 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-blue-50 text-blue-700 border-blue-200"
            )}
          >
            {localRsvpStatus}
          </Badge>
        </div>
      )}

      {/* Friend RSVP */}
      {showFriendRsvp && friendUsername && (
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-600 animate-fade-in" data-no-navigation="true">
          <Users className="h-3 w-3" />
          <span>{friendUsername} is {localRsvpStatus?.toLowerCase()}</span>
        </div>
      )}

      {/* Extra content */}
      {extraContent && (
        <div className="mt-2" data-no-navigation="true">
          {extraContent}
        </div>
      )}
    </div>
  );
};

export default EventCardActions;
