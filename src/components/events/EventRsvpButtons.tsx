
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
    sm: 'h-8 text-sm py-1 px-3',
    default: 'h-10 text-base py-2 px-4',
    lg: 'h-11 text-lg py-2 px-5',
    xl: 'h-12 text-xl py-2.5 px-6'
  };

  // If showStatusOnly is true and there's a current status, only show a badge
  if (showStatusOnly && localStatus) {
    return (
      <div className={cn("flex items-center", className)}>
        <Badge
          variant="outline"
          className={cn(
            "py-1 px-3 text-base font-medium transition-all duration-200",
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
    
    return 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-800';
  };

  // Handle RSVP with optimistic UI updates
  const handleRsvp = async (status: 'Going' | 'Interested') => {
    if (isLoading || localLoading || disabled) return;
    
    try {
      setLocalLoading(status);
      
      // Optimistically update the UI
      const newStatus = localStatus === status ? null : status;
      setLocalStatus(newStatus);
      
      // Apply button click feedback animation
      const button = document.getElementById(`rsvp-${status.toLowerCase()}`);
      if (button) {
        button.classList.add('button-click-animation');
        setTimeout(() => button.classList.remove('button-click-animation'), 200);
      }
      
      // Make the actual API call
      const success = await onRsvp(status);
      
      // If the call failed, revert the UI
      if (!success) {
        setLocalStatus(currentStatus);
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
          <Loader2 className="h-4 w-4 animate-spin" />
          {variant !== 'minimal' && status}
        </span>
      );
    }
    
    if (status === 'Going') {
      return (
        <span className="flex items-center gap-1.5">
          <Check className="h-4 w-4" />
          {variant !== 'minimal' && 'Going'}
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1.5">
          <Star className="h-4 w-4" />
          {variant !== 'minimal' && 'Interested'}
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
            'rounded-md w-9 h-9',
            getButtonStyle(isGoing, 'Going'),
            loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
          )}
          disabled={loading || disabled}
          onClick={() => handleRsvp('Going')}
          title="Going"
          data-rsvp-button="true"
        >
          {localLoading === 'Going' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Check className="h-5 w-5" />
          )}
        </Button>
        
        <Button
          id="rsvp-interested"
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            'rounded-md w-9 h-9',
            getButtonStyle(isInterested, 'Interested'),
            loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
          )}
          disabled={loading || disabled}
          onClick={() => handleRsvp('Interested')}
          title="Interested"
          data-rsvp-button="true"
        >
          {localLoading === 'Interested' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Star className="h-5 w-5" />
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
            'rounded-md text-xs',
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
            'rounded-md text-xs',
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
