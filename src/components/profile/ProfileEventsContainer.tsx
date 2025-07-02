
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileEventsSection } from './ProfileEventsSection';
import { UserProfile } from '@/types';
import { useUserEvents } from '@/hooks/useUserEvents';
import { useFriendship } from '@/hooks/useFriendship';
import { useMatchingRsvps } from '@/hooks/useMatchingRsvps';

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
  
  // Get friendship status
  const { status: friendshipStatus, sendFriendRequest } = useFriendship(user?.id, profileId);
  
  // Fetch user events using the hook
  const { 
    pastEvents, 
    upcomingEvents, 
    isLoading: eventsLoading,
    error: eventsError
  } = useUserEvents(userIdToFetch);

  // Get matching RSVPs between current user and profile user
  const { matchingEvents } = useMatchingRsvps(user?.id, isOwnProfile ? undefined : profileId);

  const handleAddFriend = async () => {
    if (!profileId) return;
    const success = await sendFriendRequest();
    if (success) {
      console.log('Friend request sent successfully');
    }
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
      matchingEvents={matchingEvents}
      currentUserId={user?.id}
    />
  );
};
