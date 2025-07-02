import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateEvent } from '@/lib/eventService';
import { toast } from 'sonner';
import { useTracking } from '@/services/trackingService';

export const usePendingEventPublisher = () => {
  const { user, loading } = useAuth();
  const { trackEventCreation } = useTracking();

  useEffect(() => {
    // Only run when auth loading is complete and user exists
    if (loading || !user) return;

    const publishPendingEvent = async () => {
      const pendingEventId = localStorage.getItem('pendingEventId');
      
      if (!pendingEventId) return;

      console.log('🎯 User authenticated, checking for pending event:', pendingEventId);

      try {
        // Update the pending event to published status
        const { data: updatedEvent, error } = await updateEvent(pendingEventId, {
          creator: user.id,
          creator_email: user.email,
          status: 'published'
        });

        if (error) {
          console.error('❌ Error publishing pending event:', error);
          // Don't show error to user for failed automatic publishing
          return;
        }

        if (updatedEvent) {
          console.log('✅ Pending event published successfully:', updatedEvent);
          
          // Track the event creation
          await trackEventCreation({
            event_id: updatedEvent.id,
            event_title: updatedEvent.title || 'Untitled Event',
            event_category: updatedEvent.event_category || 'Unknown',
            event_vibe: updatedEvent.vibe || 'Unknown',
            destination: updatedEvent.destination || 'Unknown',
            creator_id: user.id,
          });

          // Show success message
          toast.success(`🎉 Your event "${updatedEvent.title}" has been published!`, {
            description: 'Thank you for confirming your email. Your event is now live.',
            duration: 5000,
          });

          // Clear the pending event from localStorage
          localStorage.removeItem('pendingEventId');
        }
      } catch (error) {
        console.error('❌ Failed to publish pending event:', error);
        // Don't show error to user for failed automatic publishing
      }
    };

    // Small delay to ensure auth state is fully settled
    const timeoutId = setTimeout(publishPendingEvent, 1000);

    return () => clearTimeout(timeoutId);
  }, [user, loading, trackEventCreation]);
};