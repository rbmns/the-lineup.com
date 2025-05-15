
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Calendar, Loader2 } from 'lucide-react';

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
    sm: 'h-8 text-xs',
    default: 'h-10 text-sm',
    lg: 'h-11 text-base',
    xl: 'h-12 text-base'
  };

  // If showStatusOnly is true and there's a current status, only show a badge
  if (showStatusOnly && localStatus) {
    return (
      <div className={cn("flex items-center", className)}>
        <Badge
          variant="outline"
          className={cn(
            "py-1 px-3 text-xs font-medium transition-all duration-200",
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

  // Set styles based on variant
  const getButtonStyle = (active: boolean, status: 'Going' | 'Interested') => {
    if (active) {
      return status === 'Going' ? 
        'bg-[#40916C] text-white border-[#2D6A4F] hover:bg-[#2D6A4F]' : 
        'bg-[#0099CC] text-white border-[#005F73] hover:bg-[#005F73]';
    }
    
    return 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700';
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
          {status}
        </span>
      );
    }
    
    return (
      <span className="flex items-center gap-1.5">
        {isActive && <CheckCircle className="h-4 w-4" />}
        {!isActive && status === 'Going' && <CheckCircle className="h-4 w-4" />}
        {!isActive && status === 'Interested' && <Calendar className="h-4 w-4" />}
        {status}
      </span>
    );
  };

  // Compact variant - just icons with tooltip
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2 justify-center', className)}>
        <Button
          id="rsvp-going"
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            'rounded-full w-9 h-9',
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
            <CheckCircle className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          id="rsvp-interested"
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            'rounded-full w-9 h-9',
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
            <Calendar className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  // Default and minimal variants
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        id="rsvp-going"
        type="button"
        variant="outline"
        className={cn(
          buttonSizeClasses[size],
          'font-semibold border transition-all',
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
          'font-semibold border transition-all',
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
