
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RsvpButtonContent } from './RsvpButtonContent';
import { RsvpStatus, RsvpHandler } from '@/components/events/rsvp/types';

interface DefaultRsvpButtonsProps {
  currentStatus: RsvpStatus;
  onRsvp: RsvpHandler;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  activeButton: 'Going' | 'Interested' | null;
  eventId?: string;
}

export const DefaultRsvpButtons: React.FC<DefaultRsvpButtonsProps> = ({
  currentStatus,
  onRsvp,
  isLoading = false,
  disabled = false,
  className = '',
  size = 'default',
  activeButton,
  eventId = 'default-event'
}) => {
  const isGoing = currentStatus === 'Going';
  const isInterested = currentStatus === 'Interested';

  // Map size to button classes
  const buttonSizeClasses = {
    sm: 'h-7 text-xs py-1 px-2.5',
    default: 'h-8 text-sm py-1.5 px-3',
    lg: 'h-9 text-sm py-2 px-3.5',
    xl: 'h-10 text-base py-2 px-4'
  };

  // Get button styles based on active state - updated to match the reference image
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
        className={cn(
          buttonSizeClasses[size],
          'font-medium rounded-md transition-all duration-200',
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
        className={cn(
          buttonSizeClasses[size],
          'font-medium rounded-md transition-all duration-200',
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
