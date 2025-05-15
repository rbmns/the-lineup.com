
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, Star, Loader2 } from 'lucide-react';

export type RsvpStatus = 'Going' | 'Interested' | null;

interface EventRsvpButtonsProps {
  currentStatus?: RsvpStatus | null;
  onRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  variant?: 'default' | 'compact' | 'minimal';
  showStatusOnly?: boolean;
  isLoading?: boolean;
}

export const EventRsvpButtons: React.FC<EventRsvpButtonsProps> = ({
  currentStatus = null,
  onRsvp,
  loading = false,
  disabled = false,
  className = '',
  size = 'default',
  variant = 'default',
  showStatusOnly = false,
  isLoading = false
}) => {
  const [localStatus, setLocalStatus] = useState<RsvpStatus>(currentStatus);
  const [localLoading, setLocalLoading] = useState<'Going' | 'Interested' | null>(null);
  
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
  const handleRsvp = async (status: 'Going' | 'Interested') => {
    if (isLoading || localLoading || disabled) return;
    
    try {
      setLocalLoading(status);
      
      // Immediately update UI state for instant feedback (toggle behavior)
      const newStatus = localStatus === status ? null : status;
      setLocalStatus(newStatus);
      
      // Apply button click feedback animation and immediate color change
      const button = document.getElementById(`rsvp-${status.toLowerCase()}`);
      if (button) {
        button.classList.add('button-click-animation');
        
        // Immediately update button appearance
        if (newStatus) {
          button.classList.add(status === 'Going' ? 'bg-green-500' : 'bg-blue-500', 'text-white');
        } else {
          button.classList.remove('bg-green-500', 'bg-blue-500', 'text-white');
          button.classList.add('bg-gray-100', 'text-gray-700');
        }
        
        setTimeout(() => button.classList.remove('button-click-animation'), 200);
      }
      
      // Add visual feedback to the event card
      const eventCard = button?.closest('[data-event-id]');
      if (eventCard) {
        const animationClass = status === 'Going' ? 'rsvp-going-animation' : 'rsvp-interested-animation';
        eventCard.classList.add(animationClass);
        setTimeout(() => eventCard.classList.remove(animationClass), 800);
      }
      
      // Make the actual API call
      const success = await onRsvp(status);
      
      // If the call failed, revert the UI
      if (!success) {
        setLocalStatus(currentStatus);
        
        // Also revert button appearance if needed
        if (button) {
          if (currentStatus === status) {
            button.classList.add(status === 'Going' ? 'bg-green-500' : 'bg-blue-500', 'text-white');
            button.classList.remove('bg-gray-100', 'text-gray-700');
          } else {
            button.classList.remove('bg-green-500', 'bg-blue-500', 'text-white');
            button.classList.add('bg-gray-100', 'text-gray-700');
          }
        }
      }
    } catch (error) {
      console.error('RSVP error:', error);
      setLocalStatus(currentStatus);
    } finally {
      setTimeout(() => {
        setLocalLoading(null);
      }, 300);
    }
  };

  // Determine what to render inside buttons
  const renderButtonContent = (status: 'Going' | 'Interested', isActive: boolean) => {
    const isButtonLoading = localLoading === status || (isLoading && isActive);
    
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
          id="rsvp-going"
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            'rounded-md w-8 h-8',
            getButtonStyle(isGoing, 'Going'),
            loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
          )}
          disabled={loading || disabled}
          onClick={() => handleRsvp('Going')}
          title="Going"
          data-rsvp-button="true"
        >
          {localLoading === 'Going' ? (
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
            loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
          )}
          disabled={loading || disabled}
          onClick={() => handleRsvp('Interested')}
          title="Interested"
          data-rsvp-button="true"
        >
          {localLoading === 'Interested' ? (
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
            loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
          )}
          disabled={loading || disabled}
          onClick={() => handleRsvp('Going')}
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
            loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
          )}
          disabled={loading || disabled}
          onClick={() => handleRsvp('Interested')}
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
          loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
        )}
        disabled={loading || disabled}
        onClick={() => handleRsvp('Going')}
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
          loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
        )}
        disabled={loading || disabled}
        onClick={() => handleRsvp('Interested')}
        data-rsvp-button="true"
      >
        {renderButtonContent('Interested', isInterested)}
      </Button>
    </div>
  );
};

export default EventRsvpButtons;
