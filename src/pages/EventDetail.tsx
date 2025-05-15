
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventDetailParams } from '@/hooks/useEventDetailParams';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventImages } from '@/hooks/useEventImages';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { useEventMetaTags } from '@/hooks/useEventMetaTags';
import { useAuth } from '@/contexts/AuthContext';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useEventDetailHandlers } from '@/hooks/useEventDetailHandlers';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventDetailErrorState } from '@/components/events/EventDetailErrorState';
import { EventDetailLoadingState } from '@/components/events/EventDetailLoadingState';
import { ShareDialog } from '@/components/events/share/ShareDialog';
import { MainEventContent } from '@/components/events/MainEventContent';
import { EventLocationInfo } from '@/components/events/EventLocationInfo';
import { BookingInformation } from '@/components/events/BookingInformation';
import { EventFriendRsvps } from '@/components/events/EventFriendRsvps';
import { MobileRsvpFooter } from '@/components/events/MobileRsvpFooter';
import { RelatedEventsSection } from '@/components/events/RelatedEventsSection';

const EventDetail = () => {
  // Use our comprehensive params hook to get all URL parameters
  const { id, eventId, eventSlug, hasTransitionState } = useEventDetailParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isMobile } = useDeviceDetection();
  
  // Use proper ID for data fetching, prefer explicit ID over slug
  const effectiveId = id || eventId || '';
  
  // Safety check - if no valid ID is available, redirect to events page
  useEffect(() => {
    if (!effectiveId) {
      console.error("Missing event ID in URL parameters");
      toast({
        title: "Error",
        description: "Could not load the event due to missing ID", 
        variant: "destructive"
      });
      navigate('/events');
    }
  }, [effectiveId, navigate]);

  // Only fetch when we have a valid ID
  const { 
    event, 
    isLoading, 
    error, 
    attendees, 
    rsvpLoading,
    handleRsvp 
  } = useEventDetails(effectiveId);

  const { coverImage } = useEventImages(event);
  const metaTags = useEventMetaTags(event);
  const { navigateToEvent } = useEventNavigation();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // Use the event detail handlers
  const { 
    handleBackToEvents,
    handleEventTypeClick,
    wrapRsvpWithScrollPreservation
  } = useEventDetailHandlers();
  
  // Enhanced RSVP with scroll preservation
  const handleRsvpEvent = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    try {
      await handleRsvp(status);
      return true;
    } catch (error) {
      console.error('Error handling RSVP:', error);
      return false;
    }
  };
  
  // Format date for display
  const formattedDate = event?.start_time ? new Date(event.start_time).toLocaleDateString(
    'en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
  ) : null;
  
  // Set metadata for SEO
  useEffect(() => {
    if (event && metaTags) {
      metaTags.setMetaTags({
        title: event.title,
        description: event.description || '',
        imageUrl: coverImage || '',
        path: `/events/${event.slug || event.id}`
      });
    }
  }, [event, coverImage, metaTags]);

  // Show loading state while fetching
  if (isLoading) {
    return <EventDetailLoadingState />;
  }

  // Show error state if we encounter problems
  if (error || !event) {
    return (
      <EventDetailErrorState 
        error={error ? new Error(error.toString()) : new Error("Event not found")}
        onBackToEvents={handleBackToEvents}
      />
    );
  }

  const shareUrl = `${window.location.origin}/events/${event.slug || event.id}`;

  return (
    <div className="container mx-auto px-4 pt-6 pb-16">
      {/* Back button for mobile */}
      {isMobile && (
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToEvents}
            size="sm"
            className="flex items-center gap-1.5 text-gray-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main event content - takes up 2/3 of the screen on desktop */}
        <div className="lg:col-span-2">
          <MainEventContent 
            event={event}
            attendees={attendees}
            isAuthenticated={isAuthenticated}
            rsvpLoading={rsvpLoading}
            handleRsvp={handleRsvpEvent}
            isMobile={isMobile}
            imageUrl={coverImage}
            formattedDate={formattedDate}
            shareUrl={shareUrl}
            handleEventTypeClick={handleEventTypeClick}
            handleBackToEvents={handleBackToEvents}
          />

          {/* Related Events Section - always show */}
          <div className="mt-12">
            <RelatedEventsSection event={event} />
          </div>
        </div>
        
        {/* Sidebar content - takes up 1/3 of the screen on desktop */}
        <div className="space-y-6 order-first lg:order-last">
          {/* Location Card */}
          <EventLocationInfo 
            venue={event.venues} 
            className="shadow-md"
          />
          
          {/* Booking Information Card */}
          <BookingInformation 
            event={event} 
            className="shadow-md"
          />
          
          {/* Friends/Attendees Card */}
          {isAuthenticated && (
            <div className="bg-white rounded-lg border shadow-md">
              <div className="p-5">
                <h3 className="text-md font-semibold mb-3">Friends Attending</h3>
                <EventFriendRsvps 
                  going={attendees?.going || []} 
                  interested={attendees?.interested || []} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile RSVP Footer */}
      {isMobile && isAuthenticated && (
        <MobileRsvpFooter 
          currentStatus={event.rsvp_status} 
          onRsvp={handleRsvpEvent}
          onShare={() => setShareDialogOpen(true)}
        />
      )}
      
      {/* Share Dialog */}
      <ShareDialog 
        title={event.title}
        description={event.description || ""}
        eventUrl={shareUrl}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
};

export default EventDetail;
