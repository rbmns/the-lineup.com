
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfileContent } from './UserProfileContent';
import { Event, UserProfile } from '@/types';
import { filterPastEvents, sortEventsByDate } from '@/utils/date-filtering';

interface ProfileEventsContainerProps {
  profileId?: string | null;
  profile: UserProfile | null;
  isLoading?: boolean;
  isOwnProfile?: boolean;
  isBlocked?: boolean;
}

export const ProfileEventsContainer: React.FC<ProfileEventsContainerProps> = ({
  profileId,
  profile,
  isLoading = false,
  isOwnProfile = false,
  isBlocked = false
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (profileId) {
      fetchEvents(profileId);
    }
  }, [profileId]);

  const fetchEvents = async (profileId: string) => {
    setLoadingEvents(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('creator_id', profileId)
        .order('start_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const pastEvents = filterPastEvents(events);
  const sortedPastEvents = sortEventsByDate(pastEvents);

  return (
    <UserProfileContent
      profile={profile}
      pastEvents={sortedPastEvents}
      isLoading={loadingEvents || isLoading}
    />
  );
};
