
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DefaultRsvpButtonsProps {
  currentStatus: 'Going' | 'Interested' | null;
  onRsvp: (status: 'Going' | 'Interested', e?: React.MouseEvent) => Promise<boolean>;
  isLoading?: boolean;
  className?: string;
  activeButton?: 'Going' | 'Interested' | null;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'subtle' | 'outline';
}

export const DefaultRsvpButtons: React.FC<DefaultRsvpButtonsProps> = ({
  currentStatus,
  onRsvp,
  isLoading = false,
  className = '',
  activeButton = null,
  size = 'default',
  variant = 'default'
}) => {
  const isGoing = currentStatus === 'Going';
  const isInterested = currentStatus === 'Interested';

  const buttonSizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const sizeClass = buttonSizeClasses[size];

  return (
    <div 
      className={cn('flex gap-2 w-full', className)}
      data-rsvp-buttons-container="true"
    >
      <Button
        variant={isGoing ? "default" : "outline"}
        className={cn(
          'btn-primary flex-1 gap-2 transition-all duration-200',
          sizeClass,
          isGoing ? 'bg-ocean-teal hover:bg-ocean-teal/90 text-white' : 'border-ocean-teal text-ocean-teal hover:bg-ocean-teal hover:text-white',
          activeButton === 'Going' && 'scale-95'
        )}
        onClick={(e) => onRsvp('Going', e)}
        disabled={isLoading}
        data-rsvp-status="Going"
      >
        {isLoading && activeButton === 'Going' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Going...
          </>
        ) : (
          <>
            <Check className="h-4 w-4" />
            Going
          </>
        )}
      </Button>
      
      <Button
        variant={isInterested ? "default" : "outline"}
        className={cn(
          'btn-secondary flex-1 gap-2 transition-all duration-200',
          sizeClass,
          isInterested ? 'bg-sunrise-ochre hover:bg-sunrise-ochre/90 text-graphite-grey' : 'border-sunrise-ochre text-sunrise-ochre hover:bg-sunrise-ochre hover:text-graphite-grey',
          activeButton === 'Interested' && 'scale-95'
        )}
        onClick={(e) => onRsvp('Interested', e)}
        disabled={isLoading}
        data-rsvp-status="Interested"
      >
        {isLoading && activeButton === 'Interested' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Interested...
          </>
        ) : (
          <>
            <Heart className="h-4 w-4" />
            Interested
          </>
        )}
      </Button>
    </div>
  );
};
