
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileEventsSection } from './ProfileEventsSection';
import { UserProfile } from '@/types';
import { useUserEvents } from '@/hooks/useUserEvents';

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
  
  // Use the profileId if provided, otherwise fall back to current user
  const userIdToFetch = profileId || user?.id;
  
  // For now, we'll assume friendship status is 'accepted' for own profile
  // and 'none' for others (you can enhance this with real friendship logic later)
  const friendshipStatus = isOwnProfile ? 'accepted' : 'none';
  
  // Fetch user events using the hook
  const { 
    pastEvents, 
    upcomingEvents, 
    isLoading: eventsLoading 
  } = useUserEvents(userIdToFetch);

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
