import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

export interface EventRsvpButtonsProps {
  currentStatus: string | null | undefined;
  onRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  fullWidth?: boolean;
}

export const EventRsvpButtons: React.FC<EventRsvpButtonsProps> = ({ 
  currentStatus, 
  onRsvp,
  fullWidth = false
}) => {
  const isGoing = currentStatus === 'Going';
  const isInterested = currentStatus === 'Interested';

  return (
    <div className={`flex ${fullWidth ? 'w-full' : ''} space-x-2`}>
      <Button
        variant={isGoing ? 'default' : 'outline'}
        onClick={() => onRsvp('Going')}
        className={`flex-1 ${isGoing ? 'bg-primary text-primary-foreground' : ''}`}
      >
        <Check size={16} className="mr-2" />
        Going
      </Button>
      <Button
        variant={isInterested ? 'default' : 'outline'}
        onClick={() => onRsvp('Interested')}
        className={`flex-1 ${isInterested ? 'bg-primary text-primary-foreground' : ''}`}
      >
        <Star size={16} className="mr-2" />
        Interested
      </Button>
    </div>
  );
};
