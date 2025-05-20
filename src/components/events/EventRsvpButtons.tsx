
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Star, Loader2 } from 'lucide-react';
import { MinimalRsvpButtons } from './rsvp/MinimalRsvpButtons';
import { DefaultRsvpButtons } from './rsvp/DefaultRsvpButtons';

export type RsvpStatus = 'Going' | 'Interested' | null;
export type RsvpHandler = (status: 'Going' | 'Interested') => Promise<boolean>;

interface EventRsvpButtonsProps {
  currentStatus: RsvpStatus;
  onRsvp: RsvpHandler;
  isLoading?: boolean;
  showStatusOnly?: boolean;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const EventRsvpButtons: React.FC<EventRsvpButtonsProps> = ({
  currentStatus,
  onRsvp,
  isLoading = false,
  showStatusOnly = false,
  size = 'default',
  className
}) => {
  const [activeButton, setActiveButton] = useState<'Going' | 'Interested' | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);

  // Reset active button when external loading state changes or current status changes
  useEffect(() => {
    if (!isLoading) {
      setActiveButton(null);
    }
  }, [isLoading, currentStatus]);

  const isGoing = currentStatus === 'Going';
  const isInterested = currentStatus === 'Interested';

  // Enhanced RSVP handler with improved state management
  const handleRsvp = async (status: 'Going' | 'Interested', e?: React.MouseEvent) => {
    // Comprehensive event isolation
    if (e) {
      e.stopPropagation();
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      
      // Mark this event as explicitly handled
      const target = e.currentTarget as HTMLElement;
      if (target) {
        target.setAttribute('data-event-handled', 'true');
        target.setAttribute('data-rsvp-action', status);
      }
    }
    
    if (isLoading || internalLoading) return false;

    try {
      setActiveButton(status);
      setInternalLoading(true);
      
      // Call the provided onRsvp handler
      const result = await onRsvp(status);
      
      return result;
    } catch (error) {
      console.error('Error in RSVP handler:', error);
      return false;
    } finally {
      // Add slight delay for better UX
      setTimeout(() => {
        setInternalLoading(false);
      }, 300);
    }
  };

  // If minimal UI is requested, use the compact button version
  if (size === 'sm') {
    return (
      <DefaultRsvpButtons
        currentStatus={currentStatus}
        onRsvp={handleRsvp}
        isLoading={isLoading || internalLoading}
        className={className}
        activeButton={activeButton}
        size="sm"
      />
    );
  }

  // If only showing status
  if (showStatusOnly) {
    if (!currentStatus) return null;
    return (
      <div className="text-sm font-medium">
        {isGoing && (
          <span className="flex items-center text-green-600">
            <Check className="h-3 w-3 mr-1" />
            Going
          </span>
        )}
        {isInterested && (
          <span className="flex items-center text-blue-600">
            <Star className="h-3 w-3 mr-1" />
            Interested
          </span>
        )}
      </div>
    );
  }

  // Use DefaultRsvpButtons for default and larger sizes
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
        currentStatus={currentStatus}
        onRsvp={handleRsvp}
        isLoading={isLoading || internalLoading}
        className={className}
        activeButton={activeButton}
        size={size === 'lg' ? 'lg' : 'default'}
      />
    </div>
  );
};
