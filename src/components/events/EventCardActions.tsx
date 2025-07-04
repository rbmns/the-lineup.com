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
  isLoading?: boolean;
  onClick?: (e: any) => any;
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
  useSmallButtons = false,
  isLoading = false,
  onClick
}) => {
  const [localRsvpStatus, setLocalRsvpStatus] = useState<'Going' | 'Interested' | undefined>(currentRsvpStatus);
  const [localIsLoading, setLocalIsLoading] = useState(false);

  // Use the passed isLoading or local loading state
  const buttonIsLoading = isLoading || localIsLoading;

  // If we don't need to show any actions, return null
  if (!showRsvpButtons && !showRsvpStatus && !showFriendRsvp) {
    return null;
  }

  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    try {
      console.log('EventCardActions - Handling RSVP for event:', eventId, status);
      setLocalIsLoading(true);
      
      // Store current scroll and URL state for recovery
      const scrollPosition = window.scrollY;
      const currentUrl = window.location.href;
      const currentSearch = window.location.search;
      
      // Set optimistic status update
      const newStatus = localRsvpStatus === status ? undefined : status;
      setLocalRsvpStatus(newStatus);
      
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
      const success = result === undefined ? true : !!result;
      
      // Revert if the operation failed
      if (!success) {
        setLocalRsvpStatus(currentRsvpStatus);
      }
      
      // Ensure we restore scroll position and URL state
      setTimeout(() => {
        if (scrollPosition > 0) {
          window.scrollTo({ top: scrollPosition, behavior: 'auto' });
        }
        
        // If URL has changed but we're still on the events page, restore filters
        if (window.location.href !== currentUrl && window.location.pathname.includes('/events')) {
          if (window.location.search !== currentSearch) {
            history.replaceState({}, '', currentUrl);
            console.log('Restored URL filters after RSVP');
          }
        }
      }, 50);
      
      return success;
    } catch (error) {
      console.error('EventCardActions - Error handling RSVP:', error);
      setLocalRsvpStatus(currentRsvpStatus); // Revert on error
      return false;
    } finally {
      setTimeout(() => setLocalIsLoading(false), 300); // Small delay to prevent rapid clicks
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
      onClick={onClick}
    >
      {/* RSVP Buttons */}
      {showRsvpButtons && onRsvp && (
        <div 
          className="event-rsvp-buttons animate-fade-in" 
          data-no-navigation="true"
          style={{ animationDuration: '150ms' }}
          onClick={(e) => e.stopPropagation()}
        >
          <EventRsvpButtons
            currentStatus={localRsvpStatus || null}
            onRsvp={handleRsvp}
            size={buttonSize}
            className="w-full"
            isLoading={buttonIsLoading}
          />
        </div>
      )}

      {/* RSVP Status Display (no buttons) */}
      {showRsvpStatus && localRsvpStatus && !onRsvp && (
        <div className="mt-2 animate-fade-in" data-no-navigation="true">
          <Badge
            variant="outline"
            className={cn(
              "py-1 px-3 font-mono text-xs transition-all duration-200",
              localRsvpStatus === 'Going' 
                ? "bg-seafoam text-midnight border-overcast" 
                : "bg-sage text-midnight border-overcast"
            )}
          >
            {localRsvpStatus}
          </Badge>
        </div>
      )}

      {/* Friend RSVP */}
      {showFriendRsvp && friendUsername && (
        <div className="mt-2 flex items-center gap-1 font-mono text-overcast text-xs animate-fade-in" data-no-navigation="true">
          <Users className="h-3 w-3 text-clay" />
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
