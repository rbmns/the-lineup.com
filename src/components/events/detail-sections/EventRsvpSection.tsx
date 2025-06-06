import { Button } from '@/components/ui/button';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import '@/styles/rsvp-animations.css';

interface EventRsvpSectionProps {
  isOwner: boolean;
  onRsvp?: (status: 'Going' | 'Interested') => Promise<boolean>;
  isRsvpLoading: boolean;
  currentStatus?: 'Going' | 'Interested' | null;
}

export const EventRsvpSection = ({
  isOwner,
  onRsvp,
  isRsvpLoading,
  currentStatus
}: EventRsvpSectionProps) => {
  const [animating, setAnimating] = useState(false);
  const [overlay, setOverlay] = useState(false);

  // Add animation state cleanup
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (animating) {
      // Show overlay effect briefly
      setOverlay(true);
      
      timeout = setTimeout(() => {
        setAnimating(false);
        setOverlay(false);
      }, 800);
    }
    
    return () => {
      clearTimeout(timeout);
    };
  }, [animating]);

  // Apply overlay to document body
  useEffect(() => {
    if (overlay) {
      document.body.classList.add('rsvp-transition-active');
    } else {
      document.body.classList.remove('rsvp-transition-active');
    }
    
    return () => {
      document.body.classList.remove('rsvp-transition-active');
    };
  }, [overlay]);

  const handleRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!onRsvp) return false;
    
    // Start animation and show loading indicator
    setAnimating(true);
    
    try {
      // Add transition indicator to body
      document.body.classList.add('rsvp-transition');
      document.querySelector('.rsvp-transition-indicator')?.classList.add('active');
      
      // Call the actual RSVP handler
      const success = await onRsvp(status);
      
      // Keep animation going briefly to make transition smoother
      setTimeout(() => {
        setAnimating(false);
      }, 300);
      
      return success;
    } catch (error) {
      console.error('RSVP error:', error);
      setAnimating(false);
      return false;
    } finally {
      // Cleanup will happen through the useEffect
      setTimeout(() => {
        document.body.classList.remove('rsvp-transition');
        document.querySelector('.rsvp-transition-indicator')?.classList.remove('active');
      }, 500);
    }
  };

  return (
    <>
      <div className={`bg-gray-50 p-6 rounded-lg transition-all duration-300 relative ${animating ? 'rsvp-section-animating' : ''}`}>
        <div className="space-y-4">
          {onRsvp && !isOwner && (
            <>
              <h3 className="font-medium">Are you going?</h3>
              <div className={`rsvp-buttons-container ${animating ? 'rsvp-buttons-animating' : ''}`}>
                {isRsvpLoading || animating ? (
                  <div className="flex justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : (
                  <EventRsvpButtons 
                    currentStatus={currentStatus}
                    onRsvp={handleRsvp}
                    isLoading={isRsvpLoading || animating}
                    size="lg"
                    className="w-full"
                  />
                )}
              </div>
            </>
          )}
          
          {isOwner && (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700">You created this event</p>
            </div>
          )}
        </div>
        
        {animating && <div className="absolute inset-0 rsvp-shimmer rounded-lg overflow-hidden"></div>}
      </div>
      
      <div className={`rsvp-overlay ${overlay ? 'active' : ''}`}></div>
      <div className="rsvp-transition-indicator"></div>
    </>
  );
};
