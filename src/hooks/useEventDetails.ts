
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

  // Fetch event details
  const {
    data: event,
    isLoading: eventLoading,
    error: eventError,
    refetch: refetchEvent
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const eventData = await fetchEventById(eventId, user?.id);
      
      // If we have event data and a user, get the current RSVP status
      if (eventData && user?.id) {
        const rsvpData = await getUserEventRSVP(user.id, eventId);
        return {
          ...eventData,
          rsvp_status: rsvpData?.status || null
        };
      }
      
      return eventData;
    },
    enabled: !!eventId,
    staleTime: 1000 * 30, // 30 seconds - shorter to ensure fresh data
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

  // Listen for RSVP changes in other parts of the app
  useEffect(() => {
    if (!eventId || !user?.id) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `rsvp_change_${eventId}`) {
        console.log('RSVP change detected, refreshing event data...');
        refetchEvent();
        refetchAttendees();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events
    const handleRsvpChange = (e: CustomEvent) => {
      if (e.detail.eventId === eventId) {
        console.log('Custom RSVP change event detected, refreshing...');
        refetchEvent();
        refetchAttendees();
      }
    };

    window.addEventListener('rsvpChanged', handleRsvpChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rsvpChanged', handleRsvpChange as EventListener);
    };
  }, [eventId, user?.id, refetchEvent, refetchAttendees]);

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

    // Broadcast the change to other tabs/components
    localStorage.setItem(`rsvp_change_${eventId}`, Date.now().toString());
    window.dispatchEvent(new CustomEvent('rsvpChanged', { 
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
