
import React from 'react';
import { Event } from '@/types';
import { Lock } from 'lucide-react';
import { ShareDialog } from '@/components/events/share/ShareDialog';
import { MainEventContent } from '@/components/events/MainEventContent';
import { SidebarContent } from '@/components/events/SidebarContent';
import { RelatedEvents } from '@/components/events/related-events/RelatedEvents';
import { MobileRsvpFooter } from '@/components/events/MobileRsvpFooter';
import { EventDetailHeader } from './EventDetailHeader';
import { EventDetailFooter } from './EventDetailFooter';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EventDetailLayoutProps {
  event: Event;
  attendees: { going: any[]; interested: any[] };
  isAuthenticated: boolean;
  rsvpLoading: boolean;
  handleRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  isMobile: boolean;
  coverImage: string | null;
  formattedDate: string | null;
  shareUrl: string;
  handleEventTypeClick: () => void;
  handleBackToEvents: () => void;
  shareDialogOpen: boolean;
  setShareDialogOpen: (open: boolean) => void;
}

export const EventDetailLayout: React.FC<EventDetailLayoutProps> = ({
  event,
  attendees,
  isAuthenticated,
  rsvpLoading,
  handleRsvp,
  isMobile,
  coverImage,
  formattedDate,
  shareUrl,
  handleEventTypeClick,
  handleBackToEvents,
  shareDialogOpen,
  setShareDialogOpen,
}) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 pt-6 pb-24">
      {/* Back button header */}
      <EventDetailHeader 
        onBackToEvents={handleBackToEvents} 
        isMobile={isMobile} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main event content - takes up 8/12 of the screen on desktop */}
        <div className="lg:col-span-8 order-first">
          <MainEventContent 
            event={event}
            attendees={attendees}
            isAuthenticated={isAuthenticated}
            rsvpLoading={rsvpLoading}
            handleRsvp={handleRsvp}
            isMobile={isMobile}
            imageUrl={coverImage}
            formattedDate={formattedDate}
            shareUrl={shareUrl}
            handleEventTypeClick={handleEventTypeClick}
            handleBackToEvents={handleBackToEvents}
          />
        </div>
        
        {/* Sidebar content - takes up 4/12 of the screen on desktop */}
        <div className="lg:col-span-4 order-last">
          <SidebarContent 
            event={event}
            attendees={attendees}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
      
      {/* Related Events Section */}
      <div className="mt-12">
        <RelatedEvents 
          eventId={event.id} 
          eventType={event.event_type || ''}
          startDate={event.start_date || ''}
          tags={event.tags}
          vibe={event.vibe}
        />
      </div>
          
      {/* Bottom back to events button */}
      <EventDetailFooter 
        onBackToEvents={handleBackToEvents} 
        isMobile={isMobile} 
      />
      
      {/* Mobile RSVP Footer - only for authenticated users */}
      {isMobile && isAuthenticated && (
        <MobileRsvpFooter 
          currentStatus={event.rsvp_status} 
          onRsvp={handleRsvp}
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
