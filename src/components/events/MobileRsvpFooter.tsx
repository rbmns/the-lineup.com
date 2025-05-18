import React, { useState, useEffect } from 'react';
import { Share2, Check, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '@/styles/rsvp-animations.css';

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
  const [localStatus, setLocalStatus] = useState<'Going' | 'Interested' | null>(currentStatus || null);
  const [animating, setAnimating] = useState(false);

  // Update local state when props change
  useEffect(() => {
    if (currentStatus !== localStatus) {
      setLocalStatus(currentStatus || null);
    }
  }, [currentStatus]);

  // Handle animation cleanup
  useEffect(() => {
    if (animating) {
      const timer = setTimeout(() => {
        setAnimating(false);
        setLoadingStatus(null);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [animating]);

  const handleRsvp = async (status: 'Going' | 'Interested') => {
    console.log(`MobileRsvpFooter: Handling RSVP for event ${eventId}, status ${status}, currentStatus: ${currentStatus}`);
    setLoadingStatus(status);
    setAnimating(true);
    
    // Add transition indicator
    document.querySelector('.rsvp-transition-indicator')?.classList.add('active');
    
    try {
      // Apply optimistic update
      const newStatus = localStatus === status ? null : status;
      setLocalStatus(newStatus);
      
      // Apply transition effect to whole page
      document.body.classList.add('rsvp-transition');
      
      const success = await onRsvp(status);
      
      if (success) {
        console.log(`MobileRsvpFooter: RSVP successful for ${status}`);
      } else {
        console.log(`MobileRsvpFooter: RSVP failed for ${status}`);
        // Revert on failure
        setLocalStatus(currentStatus || null);
      }
      
      // Keep animation going briefly for visual consistency
      return success;
    } catch (error) {
      console.error(`MobileRsvpFooter: Error in RSVP handler:`, error);
      // Revert on error
      setLocalStatus(currentStatus || null);
      return false;
    } finally {
      // Cleanup will happen through the useEffect
      setTimeout(() => {
        document.querySelector('.rsvp-transition-indicator')?.classList.remove('active');
        document.body.classList.remove('rsvp-transition');
      }, 500); 
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-all duration-300 ${animating ? 'mobile-footer-animating' : ''}`}>
      {animating && <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"></div>}
      
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex gap-2 flex-1">
          <Button
            variant={localStatus === 'Going' ? "default" : "outline"}
            className={`flex-1 gap-2 transition-all duration-300 ${localStatus === 'Going' ? "bg-green-600 hover:bg-green-700" : "border-gray-300"} ${animating && loadingStatus === 'Going' ? 'rsvp-going-animation' : ''} ${animating ? 'rsvp-button-animating' : ''}`}
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
            variant={localStatus === 'Interested' ? "default" : "outline"}
            className={`flex-1 gap-2 transition-all duration-300 ${localStatus === 'Interested' ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300"} ${animating && loadingStatus === 'Interested' ? 'rsvp-interested-animation' : ''} ${animating ? 'rsvp-button-animating' : ''}`}
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
      <div className={`rsvp-transition-indicator ${animating ? 'active' : ''}`}></div>
    </div>
  );
};
