
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, Heart, Loader2 } from 'lucide-react';
import { DefaultRsvpButtons } from './rsvp/DefaultRsvpButtons';

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
}

export const EventRsvpButtons: React.FC<EventRsvpButtonsProps> = ({
  currentStatus,
  onRsvp,
  isLoading = false,
  showStatusOnly = false,
  size = 'default',
  variant = 'default',
  className
}) => {
  const [localStatus, setLocalStatus] = useState<RsvpStatus>(currentStatus);
  const [activeButton, setActiveButton] = useState<'Going' | 'Interested' | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);

  // Sync local status with prop changes
  useEffect(() => {
    setLocalStatus(currentStatus);
  }, [currentStatus]);

  // Reset active button when loading completes
  useEffect(() => {
    if (!isLoading && !internalLoading) {
      setActiveButton(null);
    }
  }, [isLoading, internalLoading]);

  const isGoing = localStatus === 'Going';
  const isInterested = localStatus === 'Interested';

  // Enhanced RSVP handler with optimistic updates
  const handleRsvp = async (status: 'Going' | 'Interested', e?: React.MouseEvent) => {
    // Comprehensive event isolation
    if (e) {
      e.stopPropagation();
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
    }
    
    if (isLoading || internalLoading) return false;

    try {
      setActiveButton(status);
      setInternalLoading(true);
      
      // Optimistic update - immediately update local state
      const newStatus = localStatus === status ? null : status;
      setLocalStatus(newStatus);
      
      // Call the provided onRsvp handler
      const result = await onRsvp(status);
      
      // If the operation failed, revert the optimistic update
      if (!result) {
        setLocalStatus(currentStatus);
      }
      
      return result;
    } catch (error) {
      console.error('Error in RSVP handler:', error);
      // Revert optimistic update on error
      setLocalStatus(currentStatus);
      return false;
    } finally {
      // Add slight delay for better UX
      setTimeout(() => {
        setInternalLoading(false);
      }, 300);
    }
  };

  // If only showing status
  if (showStatusOnly) {
    if (!localStatus) return null;
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

  // Use DefaultRsvpButtons for all cases
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
        currentStatus={localStatus}
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
