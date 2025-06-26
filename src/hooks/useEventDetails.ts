
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEventById, fetchEventAttendees } from '@/lib/eventService';
import { useEventRSVP } from '@/hooks/useEventRSVP';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';
import { useEffect } from 'react';

export const useEventDetails = (eventId: string | null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getUserEventRSVP } = useEventRSVP();

  // Fetch event details with consistent RSVP status
  const {
    data: event,
    isLoading: eventLoading,
    error: eventError,
    refetch: refetchEvent
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      
      // First check if we have this event in the events list cache with RSVP status
      const eventsListData = queryClient.getQueryData(['events', user?.id]);
      let cachedEventWithRsvp = null;
      
      if (eventsListData && Array.isArray(eventsListData)) {
        cachedEventWithRsvp = eventsListData.find((e: Event) => e.id === eventId);
      }
      
      // Fetch fresh event data
      const eventData = await fetchEventById(eventId, user?.id);
      
      if (eventData && user?.id) {
        // If we found cached RSVP status, use it; otherwise fetch fresh
        let rsvpStatus = cachedEventWithRsvp?.rsvp_status;
        
        if (rsvpStatus === undefined) {
          const rsvpData = await getUserEventRSVP(user.id, eventId);
          rsvpStatus = rsvpData?.status || null;
        }
        
        console.log(`Event ${eventId} RSVP status: ${rsvpStatus} (from cache: ${!!cachedEventWithRsvp?.rsvp_status})`);
        
        return {
          ...eventData,
          rsvp_status: rsvpStatus
        };
      }
      
      return eventData;
    },
    enabled: !!eventId,
    staleTime: 1000 * 10, // Reduced stale time for fresher data
  });

  // Fetch event attendees
  const {
    data: attendees,
    isLoading: attendeesLoading,
    refetch: refetchAttendees
  } = useQuery({
    queryKey: ['event-attendees', eventId],
    queryFn: () => eventId ? fetchEventAttendees(eventId) : Promise.resolve({ going: [], interested: [] }),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Listen for RSVP cache updates
  useEffect(() => {
    if (!eventId || !user?.id) return;

    const handleRsvpCacheUpdate = (e: CustomEvent) => {
      if (e.detail.eventId === eventId) {
        console.log('RSVP cache update detected for event:', eventId);
        // Don't refetch, just rely on the cache update
      }
    };

    window.addEventListener('rsvpCacheUpdated', handleRsvpCacheUpdate as EventListener);

    return () => {
      window.removeEventListener('rsvpCacheUpdated', handleRsvpCacheUpdate as EventListener);
    };
  }, [eventId, user?.id]);

  // Helper function to refresh event data after RSVP changes
  const refreshEventData = async () => {
    console.log('Refreshing event data after RSVP change...');
    await Promise.all([
      refetchEvent(),
      refetchAttendees()
    ]);
  };

  // Update cache after RSVP changes
  const updateEventRsvpStatus = (newStatus: 'Going' | 'Interested' | null) => {
    if (!eventId || !event) return;
    
    console.log(`Updating event cache with new RSVP status: ${newStatus}`);
    
    // Update the event query cache
    queryClient.setQueryData(['event', eventId], (oldData: Event | null) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        rsvp_status: newStatus
      };
    });

    // Broadcast the change to other components
    window.dispatchEvent(new CustomEvent('rsvpCacheUpdated', { 
      detail: { eventId, newStatus } 
    }));
  };

  return {
    event,
    attendees,
    isLoading: eventLoading || attendeesLoading,
    error: eventError,
    refreshEventData,
    updateEventRsvpStatus
  };
};
