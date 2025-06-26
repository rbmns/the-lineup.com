import React, { useEffect, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventDetails } from '@/hooks/useEventDetails';
import { EventDetailContent } from '@/components/events/EventDetailContent';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedRsvp } from '@/hooks/useUnifiedRsvp';

interface EventSidePanelProps {
  eventId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventSidePanel: React.FC<EventSidePanelProps> = ({
  eventId,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const { handleRsvp, loadingEventId } = useUnifiedRsvp();
  const {
    event,
    attendees,
    isLoading: eventLoading,
    error: eventError
  } = useEventDetails(eventId);

  useEffect(() => {
    // Disable scrolling when the side panel is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleRsvpClick = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!eventId) return false;
    return await handleRsvp(eventId, status);
  };

  if (eventLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error: {eventError.message}
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full sm:w-[500px] md:w-[600px] lg:w-[700px] bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out overflow-hidden flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Event Details</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {event && (
            <EventDetailContent
              event={event}
              attendees={attendees}
              onRsvp={handleRsvpClick}
              isRsvpLoading={loadingEventId === eventId}
            />
          )}
        </div>
      </div>
    </>
  );
};
