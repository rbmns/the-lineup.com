
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Calendar, XCircle } from 'lucide-react';

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
}

export const EventRsvpButtons: React.FC<EventRsvpButtonsProps> = ({
  currentStatus = null,
  onRsvp,
  loading = false,
  disabled = false,
  className = '',
  size = 'default',
  variant = 'default',
  showStatusOnly = false
}) => {
  const [localLoading, setLocalLoading] = useState<RsvpStatus | 'all' | null>(null);
  const isGoing = currentStatus === 'Going';
  const isInterested = currentStatus === 'Interested';

  // Map size to appropriate button sizes
  const buttonSizeClasses = {
    sm: 'h-8 text-xs',
    default: 'h-10 text-sm',
    lg: 'h-11 text-base',
    xl: 'h-12 text-base'
  };

  // If showStatusOnly is true and there's a current status, only show a badge
  if (showStatusOnly && currentStatus) {
    return (
      <div className={cn("flex items-center", className)}>
        <Badge
          variant="outline"
          className={cn(
            "py-1 px-3 text-xs font-medium transition-all duration-200",
            currentStatus === 'Going' 
              ? "bg-green-50 text-green-700 border-green-200" 
              : "bg-blue-50 text-blue-700 border-blue-200"
          )}
        >
          {currentStatus}
        </Badge>
      </div>
    );
  }

  // Set sizes based on variant
  const getButtonStyle = (active: boolean, status: 'Going' | 'Interested') => {
    if (variant === 'minimal') {
      return active ? 
        'bg-primary text-white hover:bg-primary-600' : 
        'bg-transparent border-gray-300 hover:bg-gray-50 text-gray-700';
    }
    
    const isGoingBtn = status === 'Going';
    
    if (active) {
      return isGoingBtn ? 
        'bg-green-500 text-white border-green-600 hover:bg-green-600' : 
        'bg-blue-500 text-white border-blue-600 hover:bg-blue-600';
    }
    
    return 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700';
  };

  // Handle RSVP with animation and loading state
  const handleRsvp = async (status: 'Going' | 'Interested') => {
    if (loading || localLoading || disabled) return;
    
    // Don't do anything if already in this status
    if ((status === 'Going' && isGoing) || (status === 'Interested' && isInterested)) {
      return;
    }
    
    try {
      setLocalLoading(status);
      const success = await onRsvp(status);
      
      // Apply success animation class
      if (success) {
        const button = document.getElementById(`rsvp-${status.toLowerCase()}`);
        if (button) {
          button.classList.add('rsvp-success-pulse');
          setTimeout(() => {
            button.classList.remove('rsvp-success-pulse');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('RSVP error:', error);
    } finally {
      setLocalLoading(null);
    }
  };

  // Determine what to render inside buttons
  const renderButtonContent = (status: 'Going' | 'Interested', isActive: boolean) => {
    const isLoading = localLoading === status || loading;
    
    if (isLoading) {
      return (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {status}
        </span>
      );
    }
    
    if (variant !== 'compact') {
      return (
        <span className="flex items-center gap-1.5">
          {isActive && <CheckCircle className="h-4 w-4" />}
          {!isActive && status === 'Going' && <CheckCircle className="h-4 w-4" />}
          {!isActive && status === 'Interested' && <Calendar className="h-4 w-4" />}
          {status}
        </span>
      );
    }
    
    // Compact variant just shows icons
    return status === 'Going' ? 
      <CheckCircle className="h-4 w-4" /> : 
      <Calendar className="h-4 w-4" />;
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
        >
          {renderButtonContent('Going', isGoing)}
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
        >
          {renderButtonContent('Interested', isInterested)}
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
      >
        {renderButtonContent('Interested', isInterested)}
      </Button>
    </div>
  );
};

export default EventRsvpButtons;
