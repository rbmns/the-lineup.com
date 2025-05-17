
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RsvpButtonContent } from './RsvpButtonContent';

interface RsvpButtonProps {
  id: string;
  eventId: string; // Add eventId parameter
  status: 'Going' | 'Interested';
  isActive: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  localLoading: 'Going' | 'Interested' | null;
  onClick: () => void;
  size: 'sm' | 'default' | 'lg' | 'xl';
  variant: 'default' | 'compact' | 'minimal';
  buttonSizeClasses: Record<string, string>;
}

export const RsvpButton: React.FC<RsvpButtonProps> = ({
  id,
  eventId,
  status,
  isActive,
  isDisabled,
  isLoading,
  localLoading,
  onClick,
  size,
  variant,
  buttonSizeClasses,
}) => {
  const getButtonStyle = () => {
    if (isActive) {
      return status === 'Going' ? 
        'bg-green-500 text-white border-green-600 hover:bg-green-600' : 
        'bg-blue-500 text-white border-blue-600 hover:bg-blue-600';
    }
    
    if (variant === 'minimal') {
      return 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700';
    }
    
    return 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700';
  };

  // Create event-specific button ID
  const buttonId = `rsvp-${status.toLowerCase()}-${eventId}`;

  // Special handling for minimal variant with just icons
  if (variant === 'minimal') {
    return (
      <Button
        id={buttonId}
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          'rounded-md w-8 h-8',
          getButtonStyle(),
          (isDisabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
        )}
        disabled={isDisabled || isLoading}
        onClick={onClick}
        title={status}
        data-rsvp-button="true"
        data-event-id={eventId}
        data-status={status}
      >
        <RsvpButtonContent 
          status={status}
          isActive={isActive}
          isLoading={isLoading}
          localLoading={localLoading}
          variant="minimal"
        />
      </Button>
    );
  }

  // Compact or default variants with text
  return (
    <Button
      id={buttonId}
      type="button"
      variant="outline"
      className={cn(
        variant === 'compact' ? 'rounded-md text-sm py-1 px-3' : buttonSizeClasses[size],
        'font-medium rounded-md transition-all',
        getButtonStyle(),
        (isDisabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
      )}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      data-rsvp-button="true"
      data-event-id={eventId}
      data-status={status}
    >
      <RsvpButtonContent 
        status={status}
        isActive={isActive}
        isLoading={isLoading}
        localLoading={localLoading}
        variant={variant}
      />
    </Button>
  );
};
