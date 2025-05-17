
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, CheckCircle2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MobileRsvpFooterProps {
  eventId: string; // Add eventId parameter
  currentStatus?: 'Going' | 'Interested' | null;
  onRsvp: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean>;
  onShare: () => void;
  loading?: boolean;
}

export const MobileRsvpFooter: React.FC<MobileRsvpFooterProps> = ({ 
  eventId,
  currentStatus, 
  onRsvp, 
  onShare,
  loading = false
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  const isLoading = loading || localLoading;
  
  const isGoing = currentStatus === 'Going';
  const isInterested = currentStatus === 'Interested';

  const handleRsvp = async (status: 'Going' | 'Interested') => {
    if (isLoading) return;
    
    try {
      setLocalLoading(true);
      await onRsvp(eventId, status); // Pass the eventId to onRsvp
    } finally {
      // Add a small delay to prevent rapid re-clicking
      setTimeout(() => setLocalLoading(false), 500);
    }
  };

  return (
    <Card className="fixed bottom-0 left-0 w-full border-t z-50 bg-white shadow-lg">
      <div className="flex items-center justify-between p-4">
        <div className="flex space-x-2 flex-1">
          <Button 
            variant={isGoing ? "default" : "outline"}
            className={cn(
              "flex items-center gap-1.5 flex-1",
              isGoing 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "hover:border-green-600 hover:text-green-600"
            )}
            disabled={isLoading}
            onClick={() => handleRsvp('Going')}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Going</span>
          </Button>
          <Button
            variant={isInterested ? "default" : "outline"}
            className={cn(
              "flex items-center gap-1.5 flex-1",
              isInterested 
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "hover:border-blue-600 hover:text-blue-600"
            )}
            disabled={isLoading}
            onClick={() => handleRsvp('Interested')}
          >
            <Star className="h-4 w-4" />
            <span>Interested</span>
          </Button>
        </div>
        <Button variant="outline" onClick={onShare} className="ml-2" disabled={isLoading}>
          <Share2 size={16} />
        </Button>
      </div>
    </Card>
  );
}
