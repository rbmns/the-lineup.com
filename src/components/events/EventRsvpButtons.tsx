
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, Star, Loader2 } from 'lucide-react';

export type RsvpStatus = 'Going' | 'Interested' | null;

interface EventRsvpButtonsProps {
  currentStatus?: RsvpStatus | null;
  onRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
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
  // Use controlled component pattern with local state that syncs with props
  const [localStatus, setLocalStatus] = useState<RsvpStatus>(currentStatus);
  const [activeButton, setActiveButton] = useState<'Going' | 'Interested' | null>(null);
  
  // Sync with parent component's state whenever it changes
  useEffect(() => {
    if (currentStatus !== localStatus) {
      console.log('EventRsvpButtons: Syncing status from prop', currentStatus);
      setLocalStatus(currentStatus);
    }
  }, [currentStatus]);
  
  // Compute derived state
  const isGoing = localStatus === 'Going';
  const isInterested = localStatus === 'Interested';

  // Map size to button classes
  const buttonSizeClasses = {
    sm: 'h-7 text-xs py-1 px-2.5',
    default: 'h-8 text-sm py-1.5 px-3',
    lg: 'h-9 text-sm py-2 px-3.5',
    xl: 'h-10 text-base py-2 px-4'
  };

  // If showStatusOnly is true and there's a current status, only show a badge
  if (showStatusOnly && localStatus) {
    return (
      <div className={cn("flex items-center", className)}>
        <Badge
          variant="outline"
          className={cn(
            "py-1 px-2 text-xs font-medium transition-all duration-200",
            localStatus === 'Going' 
              ? "bg-green-50 text-green-700 border-green-200" 
              : "bg-blue-50 text-blue-700 border-blue-200"
          )}
        >
          {localStatus}
        </Badge>
      </div>
    );
  }

  // Get button styles based on variant and active state
  const getButtonStyle = (active: boolean, status: 'Going' | 'Interested') => {
    if (active) {
      return status === 'Going' ? 
        'bg-green-500 text-white border-green-600 hover:bg-green-600' : 
        'bg-blue-500 text-white border-blue-600 hover:bg-blue-600';
    }
    
    if (variant === 'minimal') {
      return 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700';
    }
    
    return 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700';
  };

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
      
      // Call the parent's onRsvp handler
      const success = await onRsvp(status);
      
      if (!success) {
        // Revert if the operation failed
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

  // Determine if this particular button type is loading
  const isButtonLoading = (buttonType: 'Going' | 'Interested') => {
    return isLoading && activeButton === buttonType;
  };

  // Render button content (icon + text)
  const renderButtonContent = (status: 'Going' | 'Interested', isActive: boolean) => {
    const isButtonLoading = activeButton === status && isLoading;
    
    if (isButtonLoading) {
      return (
        <span className="flex items-center gap-1.5">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span className="font-medium">{status}</span>
        </span>
      );
    }
    
    if (status === 'Going') {
      return (
        <span className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5" />
          <span className="font-medium">Going</span>
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5" />
          <span className="font-medium">Interested</span>
        </span>
      );
    }
  };

  // Minimal variant - just icons
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
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
          onClick={() => handleRsvpClick('Going')}
          title="Going"
          data-rsvp-button="true"
          data-status="Going"
          data-event-button="true"
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
          onClick={() => handleRsvpClick('Interested')}
          title="Interested"
          data-rsvp-button="true"
          data-status="Interested"
          data-event-button="true"
        >
          {isButtonLoading('Interested') ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Star className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  // Compact variant - smaller buttons with text
  if (variant === 'compact') {
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
          onClick={() => handleRsvpClick('Going')}
          data-rsvp-button="true"
          data-status="Going"
          data-event-button="true"
        >
          {renderButtonContent('Going', isGoing)}
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
          onClick={() => handleRsvpClick('Interested')}
          data-rsvp-button="true"
          data-status="Interested"
          data-event-button="true"
        >
          {renderButtonContent('Interested', isInterested)}
        </Button>
      </div>
    );
  }

  // Default variant - full size buttons
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
        onClick={() => handleRsvpClick('Going')}
        data-rsvp-button="true"
        data-status="Going"
        data-event-button="true"
      >
        {renderButtonContent('Going', isGoing)}
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
        onClick={() => handleRsvpClick('Interested')}
        data-rsvp-button="true"
        data-status="Interested"
        data-event-button="true"
      >
        {renderButtonContent('Interested', isInterested)}
      </Button>
    </div>
  );
};

export default EventRsvpButtons;
