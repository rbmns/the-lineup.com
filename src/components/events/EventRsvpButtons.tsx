
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Star, Loader2 } from 'lucide-react';
import { MinimalRsvpButtons } from './rsvp/MinimalRsvpButtons';

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
  
  // For debugging
  console.log(`EventRsvpButtons (default-event): props.currentStatus updated to:`, currentStatus);

  // Reset active button when external loading state changes or current status changes
  useEffect(() => {
    if (!isLoading) {
      setActiveButton(null);
    }
  }, [isLoading, currentStatus]);

  const isGoing = currentStatus === 'Going';
  const isInterested = currentStatus === 'Interested';

  // Enhanced RSVP handler with complete event isolation
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
      
      // Store current filter state from URL and scroll position
      const urlParams = window.location.search;
      const scrollPos = window.scrollY;
      
      // Call the provided onRsvp handler
      const result = await onRsvp(status);
      
      // Attempt to restore state if needed
      setTimeout(() => {
        // Check if URL params changed during the RSVP operation
        const currentParams = window.location.search;
        if (window.location.pathname.includes('/events') && urlParams !== currentParams) {
          console.log('Filter state changed during RSVP, attempting to restore');
          window.history.replaceState({}, '', `${window.location.pathname}${urlParams}`);
        }
        
        // Restore scroll position
        window.scrollTo({ top: scrollPos, behavior: 'auto' });
      }, 50);
      
      return result;
    } catch (error) {
      console.error('Error in RSVP handler:', error);
    } finally {
      setInternalLoading(false);
    }
    
    // Return false to prevent any default behavior
    return false;
  };

  // If minimal UI is requested, use the compact button version
  if (size === 'sm') {
    return (
      <MinimalRsvpButtons
        currentStatus={currentStatus}
        onRsvp={handleRsvp}
        isLoading={isLoading || internalLoading}
        className={className}
        activeButton={activeButton}
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

  // Size classes for the buttons - use only valid size values
  const buttonSize = size === 'lg' ? 'sm' : 'sm';

  return (
    <div 
      className={cn('flex items-center space-x-2', className)} 
      data-rsvp-container="true"
      data-no-navigation="true"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
      }}
    >
      <Button
        variant="outline"
        size={buttonSize}
        className={cn(
          'rounded-full flex items-center gap-1',
          isGoing
            ? 'bg-green-500 hover:bg-green-600 text-white border-green-600'
            : 'bg-white hover:bg-gray-50'
        )}
        disabled={isLoading || internalLoading}
        onClick={(e) => handleRsvp('Going', e)}
        data-rsvp-button="true"
        data-status="Going"
        data-no-navigation="true"
      >
        {isLoading && activeButton === 'Going' ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Check className="h-3 w-3" />
        )}
        <span>Going</span>
      </Button>
      <Button
        variant="outline"
        size={buttonSize}
        className={cn(
          'rounded-full flex items-center gap-1',
          isInterested
            ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600'
            : 'bg-white hover:bg-gray-50'
        )}
        disabled={isLoading || internalLoading}
        onClick={(e) => handleRsvp('Interested', e)}
        data-rsvp-button="true"
        data-status="Interested"
        data-no-navigation="true"
      >
        {isLoading && activeButton === 'Interested' ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Star className="h-3 w-3" />
        )}
        <span>Interested</span>
      </Button>
    </div>
  );
};
