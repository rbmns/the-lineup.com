
import React from 'react';
import { cn } from '@/lib/utils';
import { RsvpButton } from './RsvpButton';
import { useRsvpButtonLogic } from './useRsvpButtonLogic';
import { RsvpStatus } from '../EventRsvpButtons';

interface RsvpButtonGroupProps {
  eventId: string; // Add eventId parameter
  currentStatus?: RsvpStatus | null;
  onRsvp: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean>;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  variant: 'default' | 'compact' | 'minimal';
}

export const RsvpButtonGroup: React.FC<RsvpButtonGroupProps> = ({
  eventId,
  currentStatus = null,
  onRsvp,
  isLoading = false,
  disabled = false,
  className = '',
  size = 'default',
  variant,
}) => {
  const {
    isGoing,
    isInterested,
    localLoading,
    combinedIsLoading,
    handleRsvpClick
  } = useRsvpButtonLogic({ eventId, currentStatus, onRsvp, isLoading });

  // Map size to appropriate button sizes
  const buttonSizeClasses = {
    sm: 'h-7 text-xs py-1 px-2.5',
    default: 'h-8 text-sm py-1.5 px-3',
    lg: 'h-9 text-sm py-2 px-3.5',
    xl: 'h-10 text-base py-2 px-4'
  };

  return (
    <div className={cn('flex items-center gap-2', className)} data-rsvp-group={eventId}>
      <RsvpButton
        id="rsvp-going"
        eventId={eventId}
        status="Going"
        isActive={isGoing}
        isDisabled={disabled}
        isLoading={combinedIsLoading('Going')}
        localLoading={localLoading}
        onClick={() => handleRsvpClick('Going')}
        size={size}
        variant={variant}
        buttonSizeClasses={buttonSizeClasses}
      />
      
      <RsvpButton
        id="rsvp-interested"
        eventId={eventId}
        status="Interested"
        isActive={isInterested}
        isDisabled={disabled}
        isLoading={combinedIsLoading('Interested')}
        localLoading={localLoading}
        onClick={() => handleRsvpClick('Interested')}
        size={size}
        variant={variant}
        buttonSizeClasses={buttonSizeClasses}
      />
    </div>
  );
};
