
import React from 'react';
import { useUserEventQueries } from '@/hooks/useUserEventQueries';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileEventsSection } from './ProfileEventsSection';
import { UserProfile } from '@/types';

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
  const { user } = useAuth();
  
  // For now, we'll assume friendship status is 'accepted' for own profile
  // and 'none' for others (you can enhance this with real friendship logic later)
  const friendshipStatus = isOwnProfile ? 'accepted' : 'none';
  
  // Fetch user events where they have RSVPed
  const { 
    userEvents, 
    isLoading: eventsLoading, 
    error 
  } = useUserEventQueries(profileId, user?.id, friendshipStatus);

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = userEvents.filter(event => {
    if (!event.start_date) return false;
    const eventDate = new Date(event.start_date);
    return eventDate >= now;
  });
  
  const pastEvents = userEvents.filter(event => {
    if (!event.start_date) return false;
    const eventDate = new Date(event.start_date);
    return eventDate < now;
  });

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
      pastEvents={pastEvents}
      eventsLoading={eventsLoading || isLoading}
      isCurrentUser={isOwnProfile}
      username={profile?.username}
      handleAddFriend={handleAddFriend}
      friendshipStatus={friendshipStatus}
    />
  );
};
