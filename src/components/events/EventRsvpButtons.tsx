
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, Heart, Loader2 } from 'lucide-react';
import { DefaultRsvpButtons } from './rsvp/DefaultRsvpButtons';
import { useTracking } from '@/services/trackingService';

export type RsvpStatus = 'Going' | 'Interested' | null;
export type RsvpHandler = (status: 'Going' | 'Interested') => Promise<boolean>;

interface EventRsvpButtonsProps {
  currentStatus: RsvpStatus;
  onRsvp: RsvpHandler;
  isLoading?: boolean;
  showStatusOnly?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'subtle' | 'outline';
  className?: string;
  eventId?: string;
  eventTitle?: string;
}

export const EventRsvpButtons: React.FC<EventRsvpButtonsProps> = ({
  currentStatus,
  onRsvp,
  isLoading = false,
  showStatusOnly = false,
  size = 'default',
  variant = 'default',
  className,
  eventId,
  eventTitle
}) => {
  const [optimisticStatus, setOptimisticStatus] = useState<RsvpStatus>(currentStatus);
  const [activeButton, setActiveButton] = useState<'Going' | 'Interested' | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);
  const { trackRSVP } = useTracking();

  // Sync optimistic status with current status when it changes from server
  useEffect(() => {
    if (!internalLoading) {
      setOptimisticStatus(currentStatus);
    }
  }, [currentStatus, internalLoading]);

  // Reset active button when loading completes
  useEffect(() => {
    if (!isLoading && !internalLoading) {
      setActiveButton(null);
    }
  }, [isLoading, internalLoading]);

  const isGoing = optimisticStatus === 'Going';
  const isInterested = optimisticStatus === 'Interested';

  // Optimistic RSVP handler with immediate visual feedback
  const handleRsvp = async (status: 'Going' | 'Interested', e?: React.MouseEvent) => {
    // Comprehensive event isolation
    if (e) {
      e.stopPropagation();
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
    }
    
    if (isLoading || internalLoading) return false;

    console.log(`EventRsvpButtons: Handling RSVP ${status}, current status: ${optimisticStatus}`);

    // Store the old status for potential rollback
    const oldStatus = optimisticStatus;
    
    // Calculate new optimistic status (toggle off if same, otherwise set new)
    const newOptimisticStatus = optimisticStatus === status ? null : status;

    try {
      setActiveButton(status);
      setInternalLoading(true);
      
      // IMMEDIATE optimistic update - this provides instant visual feedback
      setOptimisticStatus(newOptimisticStatus);
      
      // Call the server
      const result = await onRsvp(status);
      
      console.log(`EventRsvpButtons: RSVP ${status} completed with result: ${result}`);
      
      if (!result) {
        // Rollback optimistic update on failure
        console.log('RSVP failed, rolling back optimistic update');
        setOptimisticStatus(oldStatus);
      } else {
        // On success, track the RSVP action
        if (eventId && eventTitle) {
          await trackRSVP({
            event_id: eventId,
            event_title: eventTitle,
            rsvp_status: newOptimisticStatus,
            previous_status: oldStatus,
            user_id: '', // Will be filled by tracking service from auth context
          });
        }
        
        console.log(`RSVP success: keeping optimistic state ${newOptimisticStatus}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error in RSVP handler:', error);
      // Rollback optimistic update on error
      setOptimisticStatus(oldStatus);
      return false;
    } finally {
      // Add slight delay for better UX
      setTimeout(() => {
        setInternalLoading(false);
        setActiveButton(null);
      }, 300);
    }
  };

  // If only showing status
  if (showStatusOnly) {
    if (!optimisticStatus) return null;
    return (
      <div className="text-sm font-medium">
        {isGoing && (
          <span className="flex items-center text-[#005F73]">
            <Check className="h-3 w-3 mr-1" />
            Going
          </span>
        )}
        {isInterested && (
          <span className="flex items-center text-[#EDC46A]">
            <Heart className="h-3 w-3 mr-1" />
            Interested
          </span>
        )}
      </div>
    );
  }

  console.log(`EventRsvpButtons: Rendering with optimisticStatus: ${optimisticStatus}, isGoing: ${isGoing}, isInterested: ${isInterested}`);

  return (
    <div 
      className={cn('', className)} 
      data-rsvp-container="true"
      data-no-navigation="true"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
      }}
    >
      <DefaultRsvpButtons
        currentStatus={optimisticStatus}
        onRsvp={handleRsvp}
        isLoading={isLoading || internalLoading}
        className={className}
        activeButton={activeButton}
        size={size}
        variant={variant}
      />
    </div>
  );
};
