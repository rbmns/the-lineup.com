
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { RsvpStatus } from '@/components/events/rsvp/types';
import { RsvpStatusBadge } from '@/components/events/rsvp/RsvpStatusBadge';
import { MinimalRsvpButtons } from '@/components/events/rsvp/MinimalRsvpButtons';
import { CompactRsvpButtons } from '@/components/events/rsvp/CompactRsvpButtons';
import { DefaultRsvpButtons } from '@/components/events/rsvp/DefaultRsvpButtons';

export type { RsvpStatus };

interface EventRsvpButtonsProps {
  currentStatus?: RsvpStatus | null;
  onRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  variant?: 'default' | 'compact' | 'minimal';
  showStatusOnly?: boolean;
  eventId?: string;
}

export const EventRsvpButtons: React.FC<EventRsvpButtonsProps> = ({
  currentStatus = null,
  onRsvp,
  isLoading = false,
  disabled = false,
  className = '',
  size = 'default',
  variant = 'default',
  showStatusOnly = false,
  eventId = 'default-event',
}) => {
  // Use controlled component pattern with local state that syncs with props
  const [localStatus, setLocalStatus] = useState<RsvpStatus>(currentStatus);
  const [activeButton, setActiveButton] = useState<'Going' | 'Interested' | null>(null);
  
  // For debugging - log props changes
  useEffect(() => {
    console.log(`EventRsvpButtons (${eventId}): props.currentStatus updated to:`, currentStatus);
  }, [currentStatus, eventId]);
  
  // Sync with parent component's state whenever it changes
  useEffect(() => {
    if (currentStatus !== localStatus) {
      console.log(`EventRsvpButtons (${eventId}): Syncing status from prop:`, currentStatus);
      setLocalStatus(currentStatus);
    }
  }, [currentStatus, eventId, localStatus]);
  
  // If showStatusOnly is true and there's a current status, only show a badge
  if (showStatusOnly && localStatus) {
    return (
      <div className={cn("flex items-center", className)}>
        <RsvpStatusBadge 
          status={localStatus} 
          eventId={eventId} 
        />
      </div>
    );
  }

  // Handle RSVP click with proper state management
  const handleRsvpClick = async (status: 'Going' | 'Interested') => {
    if (isLoading || disabled) return;
    
    try {
      // Track which button is being clicked for UI feedback
      setActiveButton(status);
      
      // Optimistic update
      const prevStatus = localStatus;
      const newStatus = localStatus === status ? null : status;
      
      // Update local state immediately for responsive UI
      setLocalStatus(newStatus);
      
      console.log(`EventRsvpButtons (${eventId}): Handling RSVP click for status ${status}, current: ${localStatus}, new: ${newStatus}`);
      
      // Call the parent's onRsvp handler
      const success = await onRsvp(status);
      
      if (!success) {
        // Revert if the operation failed
        console.log(`EventRsvpButtons (${eventId}): RSVP failed, reverting to ${prevStatus}`);
        setLocalStatus(prevStatus);
      }
    } catch (error) {
      console.error('Error in RSVP button handler:', error);
    } finally {
      // Clear loading state
      setTimeout(() => {
        setActiveButton(null);
      }, 200);
    }
  };

  // Minimal variant - just icons
  if (variant === 'minimal') {
    return (
      <MinimalRsvpButtons
        currentStatus={localStatus}
        onRsvp={handleRsvpClick}
        isLoading={isLoading}
        disabled={disabled}
        className={className}
        activeButton={activeButton}
        eventId={eventId}
      />
    );
  }

  // Compact variant - smaller buttons with text
  if (variant === 'compact') {
    return (
      <CompactRsvpButtons
        currentStatus={localStatus}
        onRsvp={handleRsvpClick}
        isLoading={isLoading}
        disabled={disabled}
        className={className}
        activeButton={activeButton}
        eventId={eventId}
      />
    );
  }

  // Default variant - full size buttons
  return (
    <DefaultRsvpButtons
      currentStatus={localStatus}
      onRsvp={handleRsvpClick}
      isLoading={isLoading}
      disabled={disabled}
      className={className}
      size={size}
      activeButton={activeButton}
      eventId={eventId}
    />
  );
};

export default EventRsvpButtons;
