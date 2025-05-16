import React from 'react';
import { RsvpStatusBadge } from './rsvp/RsvpStatusBadge';
import { RsvpButtonGroup } from './rsvp/RsvpButtonGroup';

export type RsvpStatus = 'Going' | 'Interested' | null;

interface EventRsvpButtonsProps {
  currentStatus?: RsvpStatus | null;
  onRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  /** General loading state for the RSVP action (e.g., from a parent hook) */
  isLoading?: boolean; 
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  variant?: 'default' | 'compact' | 'minimal';
  showStatusOnly?: boolean;
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
}) => {
  // If showStatusOnly is true and there's a current status, only show a badge
  if (showStatusOnly && currentStatus) {
    return (
      <div className={className}>
        <RsvpStatusBadge status={currentStatus} />
      </div>
    );
  }

  // Otherwise show the interactive buttons
  return (
    <RsvpButtonGroup
      currentStatus={currentStatus}
      onRsvp={onRsvp}
      isLoading={isLoading}
      disabled={disabled}
      className={className}
      size={size}
      variant={variant}
    />
  );
};

export default EventRsvpButtons;
