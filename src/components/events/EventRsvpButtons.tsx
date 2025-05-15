
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, Star } from 'lucide-react';

interface EventRsvpButtonsProps {
  currentStatus: 'Going' | 'Interested' | null;
  onRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
  showStatusOnly?: boolean;
}

export const EventRsvpButtons: React.FC<EventRsvpButtonsProps> = ({
  currentStatus,
  onRsvp,
  size = 'md',
  loading = false,
  className,
  showStatusOnly = false,
}) => {
  // Add local loading state to prevent double-clicks and show optimistic updates
  const [localLoading, setLocalLoading] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState<'Going' | 'Interested' | null>(currentStatus);
  
  const isLoading = loading || localLoading;

  // If we're only showing status, render a simple indicator
  if (showStatusOnly && optimisticStatus) {
    return (
      <div className="flex items-center text-sm">
        <div className={cn(
          "px-2 py-1 rounded-full flex items-center gap-1 text-xs",
          optimisticStatus === 'Going' 
            ? "bg-green-100 text-green-700" 
            : "bg-blue-100 text-blue-700"
        )}>
          {optimisticStatus === 'Going' ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Going</span>
            </>
          ) : (
            <>
              <Star className="h-3.5 w-3.5" />
              <span>Interested</span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Size configurations - make the xs and sm sizes more compact
  const buttonSizeClasses = {
    xs: 'h-6 px-1.5 text-xs',
    sm: 'h-7 px-3 text-xs',
    md: 'h-9 px-4',
    lg: 'h-10 px-5',
  };

  // Text visibility by size
  const showTextForSize = size !== 'xs';

  // Base classes for buttons
  const buttonClasses = buttonSizeClasses[size] || buttonSizeClasses.md;

  const handleRsvp = async (status: 'Going' | 'Interested') => {
    if (isLoading) return; // Prevent multiple clicks
    
    try {
      setLocalLoading(true);
      
      // Determine the new status (toggle behavior)
      const newStatus = optimisticStatus === status ? null : status;
      
      // Update optimistically for better UX
      setOptimisticStatus(newStatus);
      
      // Call the actual RSVP handler
      await onRsvp(status);
      
      // No toast messages as requested
    } catch (error) {
      console.error('Error updating RSVP:', error);
      
      // Revert optimistic update
      setOptimisticStatus(currentStatus);
      
      // No toast message on error either
    } finally {
      // Add a small delay to prevent rapid re-clicking
      setTimeout(() => setLocalLoading(false), 300);
    }
  };

  return (
    <div 
      className={cn("flex gap-1", className)}
      data-no-navigation="true"
      onClick={(e) => e.stopPropagation()}
    >
      <Button 
        variant={optimisticStatus === 'Going' ? "default" : "outline"}
        className={cn(
          buttonClasses,
          "flex items-center gap-1 flex-shrink-0",
          optimisticStatus === 'Going' 
            ? "bg-green-600 hover:bg-green-700 text-white rsvp-going-animation"
            : "hover:border-green-600 hover:text-green-600"
        )}
        disabled={isLoading}
        onClick={() => handleRsvp('Going')}
        data-no-navigation="true"
      >
        <CheckCircle2 className={size === 'xs' ? "h-3 w-3" : "h-4 w-4"} />
        {showTextForSize && <span className="whitespace-nowrap">Going</span>}
      </Button>
      
      <Button 
        variant={optimisticStatus === 'Interested' ? "default" : "outline"}
        className={cn(
          buttonClasses,
          "flex items-center gap-1 flex-shrink-0",
          optimisticStatus === 'Interested' 
            ? "bg-blue-600 hover:bg-blue-700 text-white rsvp-interested-animation" 
            : "hover:border-blue-600 hover:text-blue-600"
        )}
        disabled={isLoading}
        onClick={() => handleRsvp('Interested')}
        data-no-navigation="true"
      >
        <Star className={size === 'xs' ? "h-3 w-3" : "h-4 w-4"} />
        {showTextForSize && <span className="whitespace-nowrap">Interested</span>}
      </Button>
    </div>
  );
};
