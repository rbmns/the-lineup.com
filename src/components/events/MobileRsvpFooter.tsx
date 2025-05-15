import React from 'react';
import { Event } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

export interface MobileRsvpFooterProps {
  event?: Event;
  currentStatus?: string;
  onRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  onShare: () => void;
}

export const MobileRsvpFooter: React.FC<MobileRsvpFooterProps> = ({ 
  currentStatus, 
  onRsvp, 
  onShare 
}) => {
  const isGoing = currentStatus === 'Going';
  const isInterested = currentStatus === 'Interested';

  return (
    <Card className="fixed bottom-0 left-0 w-full border-t z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex space-x-2">
          <Button 
            variant={isGoing ? "default" : "outline"}
            onClick={() => onRsvp(isGoing ? null : 'Going')}
          >
            {isGoing ? "Going" : "Going?"}
          </Button>
          <Button
            variant={isInterested ? "default" : "outline"}
            onClick={() => onRsvp(isInterested ? null : 'Interested')}
          >
            {isInterested ? "Interested" : "Interested?"}
          </Button>
        </div>
        <Button variant="secondary" onClick={onShare}>
          <Share2 size={16} className="mr-2" />
          Share
        </Button>
      </div>
    </Card>
  );
}
