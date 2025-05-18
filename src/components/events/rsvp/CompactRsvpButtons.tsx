
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RsvpButtonContent } from './RsvpButtonContent';
import { RsvpStatus, RsvpHandler } from '@/components/events/rsvp/types';

interface CompactRsvpButtonsProps {
  currentStatus: RsvpStatus;
  onRsvp: RsvpHandler;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  activeButton: 'Going' | 'Interested' | null;
  eventId?: string;
}

export const CompactRsvpButtons: React.FC<CompactRsvpButtonsProps> = ({
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
    
    return 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700';
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          'rounded-md text-sm py-1 px-3',
          getButtonStyle(isGoing, 'Going'),
          (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
        )}
        disabled={disabled || isLoading}
        onClick={() => onRsvp('Going')}
        data-rsvp-button="true"
        data-status="Going"
        data-event-button="true"
        data-event-id={eventId}
      >
        <RsvpButtonContent 
          status="Going" 
          isLoading={isLoading && activeButton === 'Going'} 
        />
      </Button>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          'rounded-md text-sm py-1 px-3',
          getButtonStyle(isInterested, 'Interested'),
          (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
        )}
        disabled={disabled || isLoading}
        onClick={() => onRsvp('Interested')}
        data-rsvp-button="true"
        data-status="Interested"
        data-event-button="true"
        data-event-id={eventId}
      >
        <RsvpButtonContent 
          status="Interested" 
          isLoading={isLoading && activeButton === 'Interested'} 
        />
      </Button>
    </div>
  );
};
