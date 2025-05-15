
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EventRsvpButtonsProps {
  currentStatus: string | null | undefined;
  onRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  fullWidth?: boolean;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  loading?: boolean;
}

export const EventRsvpButtons: React.FC<EventRsvpButtonsProps> = ({ 
  currentStatus, 
  onRsvp,
  fullWidth = false,
  size = 'default',
  className,
  loading = false
}) => {
  const isGoing = currentStatus === 'Going';
  const isInterested = currentStatus === 'Interested';

  // Determine button size and padding
  const buttonSize = {
    sm: 'h-8 text-xs px-2',
    default: 'h-10 text-sm px-4',
    lg: 'h-12 text-base px-6'
  }[size];

  // Determine icon size
  const iconSize = {
    sm: 14,
    default: 16,
    lg: 18
  }[size];

  return (
    <div className={cn(
      `flex ${fullWidth ? 'w-full' : ''} space-x-2`,
      className
    )}>
      <Button
        variant={isGoing ? 'default' : 'outline'}
        onClick={() => onRsvp('Going')}
        className={cn(
          "flex-1",
          isGoing ? 'bg-primary text-primary-foreground' : '',
          buttonSize
        )}
        disabled={loading}
      >
        <Check size={iconSize} className="mr-2" />
        Going
      </Button>
      <Button
        variant={isInterested ? 'default' : 'outline'}
        onClick={() => onRsvp('Interested')}
        className={cn(
          "flex-1",
          isInterested ? 'bg-primary text-primary-foreground' : '',
          buttonSize
        )}
        disabled={loading}
      >
        <Star size={iconSize} className="mr-2" />
        Interested
      </Button>
    </div>
  );
};
