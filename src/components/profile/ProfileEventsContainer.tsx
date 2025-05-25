
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ProfileEventsSection } from './ProfileEventsSection';
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
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'pending' | 'accepted'>('none');

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
        .order('start_date', { ascending: true });
      
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

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.start_date) >= now);
  const pastEvents = filterPastEvents(events);
  const sortedPastEvents = sortEventsByDate(pastEvents);

  const handleAddFriend = () => {
    // Friend request logic would go here
    console.log('Add friend clicked');
  };

  // Determine if user can view events based on friendship status and profile privacy
  const canViewEvents = isOwnProfile || friendshipStatus === 'accepted' || !isBlocked;

  return (
    <ProfileEventsSection
      canViewEvents={canViewEvents}
      upcomingEvents={upcomingEvents}
      pastEvents={sortedPastEvents}
      eventsLoading={loadingEvents || isLoading}
      isCurrentUser={isOwnProfile}
      username={profile?.username}
      handleAddFriend={handleAddFriend}
      friendshipStatus={friendshipStatus}
    />
  );
};
