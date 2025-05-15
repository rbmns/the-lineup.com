
import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import { supabase } from '@/lib/supabase';
import { processEventData } from '@/utils/eventProcessorUtils';

interface UserEventsFetcherProps {
  currentUserId?: string;
  profileUserId?: string;
  friendshipStatus: 'none' | 'pending' | 'accepted' | 'requested';
  children: (data: {
    currentUserEvents: Event[];
    isLoading: boolean;
  }) => React.ReactNode;
}

export const UserEventsFetcher: React.FC<UserEventsFetcherProps> = ({
  currentUserId,
  profileUserId,
  friendshipStatus,
  children
}) => {
  const [currentUserEvents, setCurrentUserEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current user's events to compare RSVPs
  useEffect(() => {
    const fetchCurrentUserEvents = async () => {
      if (!currentUserId || profileUserId === currentUserId) {
        return; // Don't need to fetch if viewing own profile
      }

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('event_rsvps')
          .select(`
            status,
            events (
              id, title, description, event_type,
              start_time, end_time, image_urls, creator, venue_id,
              venues:venue_id (
                id, name, street, city
              ),
              created_at, updated_at
            )
          `)
          .eq('user_id', currentUserId);
          
        if (error) {
          console.error('Error fetching current user events:', error);
          return;
        }
        
        const events = data
          .filter(item => item.events)
          .map(item => {
            const eventData = item.events as any;
            const processedEvent = processEventData(eventData, currentUserId);
            return {
              ...processedEvent,
              rsvp_status: item.status as 'Going' | 'Interested'
            };
          });
          
        console.log(`Fetched ${events.length} events for current user`);
        setCurrentUserEvents(events);
      } catch (err) {
        console.error('Exception fetching current user events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentUserId && friendshipStatus === 'accepted') {
      fetchCurrentUserEvents();
    }
  }, [currentUserId, profileUserId, friendshipStatus]);

  return (
    <>
      {children({
        currentUserEvents,
        isLoading
      })}
    </>
  );
};
