
import React, { useState } from 'react';
import { Share2, Check, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileRsvpFooterProps {
  currentStatus?: 'Going' | 'Interested' | null;
  onRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  onShare: () => void;
  eventId: string;
}

export const MobileRsvpFooter: React.FC<MobileRsvpFooterProps> = ({
  currentStatus,
  onRsvp,
  onShare,
  eventId
}) => {
  const isGoing = currentStatus === 'Going';
  const isInterested = currentStatus === 'Interested';
  const [loadingStatus, setLoadingStatus] = useState<'Going' | 'Interested' | null>(null);

  const handleRsvp = async (status: 'Going' | 'Interested') => {
    console.log(`MobileRsvpFooter: Handling RSVP for event ${eventId}, status ${status}`);
    setLoadingStatus(status);
    try {
      const success = await onRsvp(status);
      if (success) {
        console.log(`MobileRsvpFooter: RSVP successful for ${status}`);
      } else {
        console.log(`MobileRsvpFooter: RSVP failed for ${status}`);
      }
    } catch (error) {
      console.error(`MobileRsvpFooter: Error in RSVP handler:`, error);
    } finally {
      setLoadingStatus(null);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex gap-2 flex-1">
          <Button
            variant={isGoing ? "default" : "outline"}
            className={`flex-1 gap-2 ${isGoing ? "bg-green-600 hover:bg-green-700" : "border-gray-300"}`}
            onClick={() => handleRsvp('Going')}
            data-rsvp-button="true"
            data-status="Going"
            data-event-id={eventId}
            disabled={loadingStatus !== null}
          >
            {loadingStatus === 'Going' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Going
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
            className={`flex-1 gap-2 ${isInterested ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300"}`}
            onClick={() => handleRsvp('Interested')}
            data-rsvp-button="true"
            data-status="Interested"
            data-event-id={eventId}
            disabled={loadingStatus !== null}
          >
            {loadingStatus === 'Interested' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Interested
              </>
            ) : (
              <>
                <Star className="h-4 w-4" />
                Interested
              </>
            )}
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={onShare}
          data-share-button="true"
          disabled={loadingStatus !== null}
        >
          <Share2 className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};
