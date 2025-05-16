import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, Star, Loader2 } from 'lucide-react';

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
  isLoading = false, // This prop indicates if the parent considers this event's RSVP action as loading
  disabled = false,
  className = '',
  size = 'default',
  variant = 'default',
  showStatusOnly = false,
}) => {
  const [localStatus, setLocalStatus] = useState<RsvpStatus>(currentStatus);
  // localLoading is for the button's own optimistic click feedback
  const [localLoading, setLocalLoading] = useState<'Going' | 'Interested' | null>(null); 

  // Update localStatus whenever currentStatus prop changes - with debug log
  useEffect(() => {
    console.log(`EventRsvpButtons: currentStatus changed to ${currentStatus} from ${localStatus}`);
    setLocalStatus(currentStatus);
  }, [currentStatus]);
  
  const isGoing = localStatus === 'Going';
  const isInterested = localStatus === 'Interested';

  // Map size to appropriate button sizes
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

  // Handle RSVP with optimistic UI updates
  const handleRsvpClick = async (status: 'Going' | 'Interested') => {
    // Disable if parent says it's loading, or if local action is in progress, or general disabled
    if (isLoading || localLoading || disabled) return; 
    
    setLocalLoading(status);
    const prevLocalStatus = localStatus; // Store previous status for potential revert
    const newOptimisticStatus = localStatus === status ? null : status;
    setLocalStatus(newOptimisticStatus);
      
    // Apply button click feedback animation and immediate color change (already in original code)
    const button = document.getElementById(`rsvp-${status.toLowerCase()}`);
    if (button) {
      button.classList.add('button-click-animation');
      if (newOptimisticStatus) {
        button.classList.add(status === 'Going' ? 'bg-green-500' : 'bg-blue-500', 'text-white');
        button.classList.remove('bg-gray-100', 'text-gray-700');
      } else {
        button.classList.remove('bg-green-500', 'bg-blue-500', 'text-white');
        button.classList.add('bg-gray-100', 'text-gray-700');
      }
      setTimeout(() => button.classList.remove('button-click-animation'), 200);
    }
      
    // Visual feedback on event card (already in original code)
    const eventCard = button?.closest('[data-event-id]');
    if (eventCard) {
      const animationClass = status === 'Going' ? 'rsvp-going-animation' : 'rsvp-interested-animation';
      eventCard.classList.add(animationClass);
      setTimeout(() => eventCard.classList.remove(animationClass), 800);
    }
      
    try {
      const success = await onRsvp(status);
      if (!success) {
        // Revert optimistic update if the actual call failed
        setLocalStatus(prevLocalStatus); 
        // Revert button appearance (already in original code, check if still needed or handled by localStatus change)
        if (button) {
          if (prevLocalStatus === status) { // If it was active and failed to deactivate
            button.classList.add(status === 'Going' ? 'bg-green-500' : 'bg-blue-500', 'text-white');
            button.classList.remove('bg-gray-100', 'text-gray-700');
          } else { // If it was inactive and failed to activate
            button.classList.remove('bg-green-500', 'bg-blue-500', 'text-white');
            button.classList.add('bg-gray-100', 'text-gray-700');
          }
        }
      }
      // If successful, localStatus is already optimistically set. Parent's `currentStatus` prop change will confirm via useEffect.
    } catch (error) {
      console.error('RSVP error:', error);
      setLocalStatus(prevLocalStatus); // Revert on exception
      // Revert button appearance (similar to !success case)
    } finally {
      setTimeout(() => {
        setLocalLoading(null);
      }, 300); // Delay to allow animations/transitions
    }
  };

  // isLoading combines parent loading state and local click loading state
  const combinedIsLoading = (buttonType: 'Going' | 'Interested') => isLoading || localLoading === buttonType;

  // Determine what to render inside buttons
  const renderButtonContent = (status: 'Going' | 'Interested', isActive: boolean) => {
    // Use combinedIsLoading to determine if this specific button type should show a loader
    const isButtonActuallyLoading = combinedIsLoading(status) && (isActive || localLoading === status);
    
    if (isButtonActuallyLoading) {
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
          id="rsvp-going"
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            'rounded-md w-8 h-8',
            getButtonStyle(isGoing, 'Going'),
            (disabled || combinedIsLoading('Going')) ? 'opacity-50 cursor-not-allowed' : ''
          )}
          disabled={disabled || combinedIsLoading('Going')}
          onClick={() => handleRsvpClick('Going')}
          title="Going"
          data-rsvp-button="true"
        >
          {combinedIsLoading('Going') && localLoading === 'Going' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          id="rsvp-interested"
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            'rounded-md w-8 h-8',
            getButtonStyle(isInterested, 'Interested'),
            (disabled || combinedIsLoading('Interested')) ? 'opacity-50 cursor-not-allowed' : ''
          )}
          disabled={disabled || combinedIsLoading('Interested')}
          onClick={() => handleRsvpClick('Interested')}
          title="Interested"
          data-rsvp-button="true"
        >
          {combinedIsLoading('Interested') && localLoading === 'Interested' ? (
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
          id="rsvp-going"
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            'rounded-md text-sm py-1 px-3',
            getButtonStyle(isGoing, 'Going'),
            (disabled || combinedIsLoading('Going')) ? 'opacity-50 cursor-not-allowed' : ''
          )}
          disabled={disabled || combinedIsLoading('Going')}
          onClick={() => handleRsvpClick('Going')}
          data-rsvp-button="true"
        >
          {renderButtonContent('Going', isGoing)}
        </Button>
        
        <Button
          id="rsvp-interested"
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            'rounded-md text-sm py-1 px-3',
            getButtonStyle(isInterested, 'Interested'),
            (disabled || combinedIsLoading('Interested')) ? 'opacity-50 cursor-not-allowed' : ''
          )}
          disabled={disabled || combinedIsLoading('Interested')}
          onClick={() => handleRsvpClick('Interested')}
          data-rsvp-button="true"
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
        id="rsvp-going"
        type="button"
        variant="outline"
        className={cn(
          buttonSizeClasses[size],
          'font-medium rounded-md transition-all',
          getButtonStyle(isGoing, 'Going'),
          (disabled || combinedIsLoading('Going')) ? 'opacity-50 cursor-not-allowed' : ''
        )}
        disabled={disabled || combinedIsLoading('Going')}
        onClick={() => handleRsvpClick('Going')}
        data-rsvp-button="true"
      >
        {renderButtonContent('Going', isGoing)}
      </Button>
      
      <Button
        id="rsvp-interested"
        type="button"
        variant="outline"
        className={cn(
          buttonSizeClasses[size],
          'font-medium rounded-md transition-all',
          getButtonStyle(isInterested, 'Interested'),
          (disabled || combinedIsLoading('Interested')) ? 'opacity-50 cursor-not-allowed' : ''
        )}
        disabled={disabled || combinedIsLoading('Interested')}
        onClick={() => handleRsvpClick('Interested')}
        data-rsvp-button="true"
      >
        {renderButtonContent('Interested', isInterested)}
      </Button>
    </div>
  );
};

export default EventRsvpButtons;
