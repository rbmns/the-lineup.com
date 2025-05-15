
import React from 'react';
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
  // If we don't need to show any actions, return null
  if (!showRsvpButtons && !showRsvpStatus && !showFriendRsvp) {
    return null;
  }

  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    try {
      console.log('EventCardActions - Handling RSVP for event:', eventId, status);
      
      // Add improved visual feedback with animation
      const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
      if (eventCard) {
        // Apply faster animation with less flickering
        eventCard.classList.add('transition-all', 'duration-200');
        
        if (status === 'Going') {
          eventCard.classList.add('rsvp-going-animation');
          setTimeout(() => eventCard.classList.remove('rsvp-going-animation'), 400);
        } else {
          eventCard.classList.add('rsvp-interested-animation');
          setTimeout(() => eventCard.classList.remove('rsvp-interested-animation'), 400);
        }
      }
      
      const result = await onRsvp(eventId, status);
      return result === undefined ? true : !!result; // Convert void to boolean if needed
    } catch (error) {
      console.error('EventCardActions - Error handling RSVP:', error);
      return false;
    }
  };

  // Determine the appropriate button size based on compact mode and useSmallButtons prop
  const buttonSize = useSmallButtons ? 'sm' : (compact ? 'sm' : 'default');

  return (
    <div 
      className={cn(
        "event-rsvp-container", 
        "mt-2",
        "transition-all duration-200"
      )}
      data-no-navigation="true"
      data-rsvp-container="true"
    >
      {/* RSVP Buttons */}
      {showRsvpButtons && onRsvp && (
        <div 
          className="event-rsvp-buttons animate-fade-in" 
          data-no-navigation="true"
          style={{ animationDuration: '150ms' }}
        >
          <EventRsvpButtons
            currentStatus={currentRsvpStatus}
            onRsvp={handleRsvp}
            size={buttonSize}
            className="w-full"
          />
        </div>
      )}

      {/* RSVP Status Display (no buttons) */}
      {showRsvpStatus && currentRsvpStatus && !onRsvp && (
        <div className="mt-2 animate-fade-in" data-no-navigation="true">
          <Badge
            variant="outline"
            className={cn(
              "py-1 px-3 text-xs font-medium transition-all duration-200",
              currentRsvpStatus === 'Going' 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-blue-50 text-blue-700 border-blue-200"
            )}
          >
            {currentRsvpStatus}
          </Badge>
        </div>
      )}

      {/* Friend RSVP */}
      {showFriendRsvp && friendUsername && (
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-600 animate-fade-in" data-no-navigation="true">
          <Users className="h-3 w-3" />
          <span>{friendUsername} is {currentRsvpStatus?.toLowerCase()}</span>
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
