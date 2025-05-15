
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, Star } from 'lucide-react';

interface EventRsvpButtonsProps {
  currentStatus: 'Going' | 'Interested' | null;
  onRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  size?: 'sm' | 'md' | 'lg';
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
  // If we're only showing status, render a simple indicator
  if (showStatusOnly && currentStatus) {
    return (
      <div className="flex items-center text-sm">
        <div className={cn(
          "px-2 py-1 rounded-full flex items-center gap-1 text-xs",
          currentStatus === 'Going' 
            ? "bg-green-100 text-green-700" 
            : "bg-blue-100 text-blue-700"
        )}>
          {currentStatus === 'Going' ? (
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

  // Size configurations
  const buttonSizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4',
    lg: 'h-10 px-5',
  };

  // Base classes for buttons
  const buttonClasses = buttonSizeClasses[size] || buttonSizeClasses.md;

  return (
    <div className={cn("flex gap-2", className)}>
      <Button 
        variant={currentStatus === 'Going' ? "default" : "outline"}
        className={cn(
          buttonClasses,
          "flex items-center gap-1.5",
          currentStatus === 'Going' 
            ? "bg-green-600 hover:bg-green-700 text-white rsvp-going-animation"
            : "hover:border-green-600 hover:text-green-600"
        )}
        disabled={loading}
        onClick={async () => {
          await onRsvp('Going');
        }}
      >
        <CheckCircle2 className="h-4 w-4" />
        <span>{currentStatus === 'Going' ? 'Going' : 'Going'}</span>
      </Button>
      
      <Button 
        variant={currentStatus === 'Interested' ? "default" : "outline"}
        className={cn(
          buttonClasses,
          "flex items-center gap-1.5",
          currentStatus === 'Interested' 
            ? "bg-blue-600 hover:bg-blue-700 text-white rsvp-interested-animation" 
            : "hover:border-blue-600 hover:text-blue-600"
        )}
        disabled={loading}
        onClick={async () => {
          await onRsvp('Interested');
        }}
      >
        <Star className="h-4 w-4" />
        <span>Interested</span>
      </Button>
    </div>
  );
};
