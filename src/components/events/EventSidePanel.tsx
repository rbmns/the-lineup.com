
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventRsvpHandler } from '@/hooks/events/useEventRsvpHandler';
import { useAuth } from '@/contexts/AuthContext';
import { EventDetailContent } from './EventDetailContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EventSidePanelProps {
  eventId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventSidePanel: React.FC<EventSidePanelProps> = ({
  eventId,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { event, attendees, isLoading, error, refreshEventData, updateEventRsvpStatus } = useEventDetails(eventId);
  const { handleRsvp, rsvpLoading } = useEventRsvpHandler(eventId || '');

  // Enhanced RSVP handler that updates cache and refreshes data
  const handleRsvpWithRefresh = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!eventId || !user) return false;
    
    console.log(`EventSidePanel: Handling RSVP for event ${eventId} with status ${status}`);
    console.log(`EventSidePanel: Current RSVP status before action: ${event?.rsvp_status}`);
    
    try {
      // Determine new status based on toggle behavior
      let newStatus: 'Going' | 'Interested' | null = status;
      if (event?.rsvp_status === status) {
        // If clicking the same status, toggle it off
        newStatus = null;
      }
      
      // Optimistically update the cache
      updateEventRsvpStatus(newStatus);
      
      // Perform the actual RSVP operation
      const success = await handleRsvp(status);
      
      if (success) {
        console.log(`EventSidePanel: RSVP successful, new status: ${newStatus}`);
        // Refresh the data to ensure consistency
        await refreshEventData();
      } else {
        console.log('EventSidePanel: RSVP failed, reverting cache');
        // Revert the optimistic update if the operation failed
        updateEventRsvpStatus(event?.rsvp_status || null);
      }
      
      return success;
    } catch (error) {
      console.error('EventSidePanel: Error in RSVP handler:', error);
      // Revert the optimistic update if there was an error
      updateEventRsvpStatus(event?.rsvp_status || null);
      return false;
    }
  };

  // Close panel with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        {isLoading && (
          <div className="p-8 space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}

        {error && (
          <div className="p-8">
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load event details. Please try again.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {event && !isLoading && (
          <EventDetailContent
            event={event}
            attendees={attendees}
            onRsvp={handleRsvpWithRefresh}
            isRsvpLoading={rsvpLoading}
            isOwner={event.creator?.id === user?.id}
          />
        )}
      </div>
    </div>
  );
};
