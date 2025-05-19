
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Star, Loader2 } from 'lucide-react';
import { RsvpStatus, RsvpHandler } from '@/components/events/EventRsvpButtons';

interface MinimalRsvpButtonsProps {
  currentStatus: RsvpStatus;
  onRsvp: (status: 'Going' | 'Interested', e?: React.MouseEvent) => Promise<boolean | void>;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  activeButton: 'Going' | 'Interested' | null;
  eventId?: string;
}

export const MinimalRsvpButtons: React.FC<MinimalRsvpButtonsProps> = ({
  currentStatus,
  onRsvp,
  isLoading = false,
  disabled = false,
  className = '',
  activeButton,
  eventId = 'default-event'
}) => {
  const isGoing = currentStatus === 'Going';
  const isInterested = currentStatus === 'Interested';

  // Get button styles based on active state
  const getButtonStyle = (active: boolean, status: 'Going' | 'Interested') => {
    if (active) {
      return status === 'Going' ? 
        'bg-green-500 text-white border-green-600 hover:bg-green-600' : 
        'bg-blue-500 text-white border-blue-600 hover:bg-blue-600';
    }
    
    return 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700';
  };

  // Determine if this particular button type is loading
  const isButtonLoading = (buttonType: 'Going' | 'Interested') => {
    return isLoading && activeButton === buttonType;
  };

  // Handle click with proper event stopping
  const handleClick = (status: 'Going' | 'Interested', e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onRsvp(status, e);
  };

  return (
    <div 
      className={cn('flex items-center gap-2', className)}
      data-rsvp-container="true" 
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          'rounded-md w-8 h-8',
          getButtonStyle(isGoing, 'Going'),
          (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
        )}
        disabled={disabled || isLoading}
        onClick={(e) => handleClick('Going', e)}
        title="Going"
        data-rsvp-button="true"
        data-status="Going"
        data-event-button="true"
        data-event-id={eventId}
      >
        {isButtonLoading('Going') ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </Button>
      
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          'rounded-md w-8 h-8',
          getButtonStyle(isInterested, 'Interested'),
          (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
        )}
        disabled={disabled || isLoading}
        onClick={(e) => handleClick('Interested', e)}
        title="Interested"
        data-rsvp-button="true"
        data-status="Interested"
        data-event-button="true"
        data-event-id={eventId}
      >
        {isButtonLoading('Interested') ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Star className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
