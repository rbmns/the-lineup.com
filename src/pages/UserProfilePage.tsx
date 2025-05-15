
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { filterUpcomingEvents, filterPastEvents, sortEventsByDate } from '@/utils/dateUtils';
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileLoading } from '@/components/profile/ProfileLoading';
import { AuthCheck } from '@/components/profile/AuthCheck';
import { useFriendship } from '@/hooks/useFriendship';
import { UserEventsFetcher } from '@/components/profile/UserEventsFetcher';
import { ProfileAccessControl } from '@/components/profile/ProfileAccessControl';
import { toast } from '@/hooks/use-toast';
import { checkRealTimeFriendshipStatus } from '@/utils/friendshipUtils';
import { BackButton } from '@/components/profile/BackButton';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { FriendManagement } from '@/components/profile/FriendManagement';
import { ProfileNotFound } from '@/components/profile/ProfileNotFound';
import { ProfileEventsSection } from '@/components/profile/ProfileEventsSection';
import { useNavigate } from 'react-router-dom';
import { useUserEvents } from '@/hooks/useUserEvents';

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, isAuthenticated, loading } = useAuth();
  const { profile, loading: profileLoading, refreshProfile, error } = useProfileData(userId);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'pending' | 'accepted'>('none');
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [hasDirectNavigation, setHasDirectNavigation] = useState(false);

  // Check if this was a direct navigation 
  useEffect(() => {
    const state = location.state as { fromDirectNavigation?: boolean } | null;
    if (state && state.fromDirectNavigation) {
      console.log("Direct navigation to profile detected");
      setHasDirectNavigation(true);
    }
  }, [location]);

  // Display error toasts if profile couldn't be loaded
  useEffect(() => {
    if (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error loading profile",
        description: "Could not load this user's profile. Please try again.",
        variant: "destructive"
      });
    }
  }, [error]);

  // Load profile data when component mounts or userId changes
  useEffect(() => {
    const loadProfile = async () => {
      if (userId) {
        console.log("Initial profile load for:", userId);
        await refreshProfile(true);
        setInitialLoadComplete(true);
      }
    };
    
    loadProfile();
  }, [userId, refreshProfile]);

  // Check friendship status when user is authenticated
  useEffect(() => {
    const checkFriendship = async () => {
      if (user?.id && userId && user.id !== userId) {
        try {
          console.log(`Checking friendship between ${user.id} and ${userId}`);
          const status = await checkRealTimeFriendshipStatus(user.id, userId);
          console.log(`Friendship status is: ${status}`);
          setFriendshipStatus(status);
        } catch (err) {
          console.error('Error checking friendship status:', err);
        }
      } else if (user?.id && userId && user.id === userId) {
        // Own profile, no friendship needed
        console.log("Viewing own profile");
      }
    };

    if (user?.id && userId) {
      checkFriendship();
    }
  }, [user?.id, userId]);

  // Get events data after friendship status is determined
  const { 
    userEvents, 
    isLoading: eventsLoading
  } = useUserEvents(userId, user?.id, friendshipStatus);

  const canViewEvents = user?.id === userId || friendshipStatus === 'accepted';
  const upcomingEvents = sortEventsByDate(filterUpcomingEvents(userEvents || []));
  const pastEvents = filterPastEvents(userEvents || []);

  const handleAddFriend = async () => {
    if (user?.id && profile?.id) {
      const { initiateFriendRequest } = useFriendship();
      const result = await initiateFriendRequest(profile.id);
      if (result) {
        setFriendshipStatus('pending');
      }
    }
  };

  if (loading || (profileLoading && !initialLoadComplete)) {
    return <ProfileLoading />;
  }

  if (!isAuthenticated || !user) {
    return <AuthCheck />;
  }

  return (
    <ProfileAccessControl
      profile={profile}
      user={user}
      userId={userId}
      loading={loading}
      profileLoading={profileLoading}
      isAuthenticated={isAuthenticated}
      friendshipStatus={friendshipStatus}
    >
      <div className="container max-w-4xl py-8">
        <BackButton className="mb-4" />
        
        {profile ? (
          <>
            <ProfileHeader 
              profile={{
                id: profile.id || '',
                username: profile.username || '',
                avatar_url: Array.isArray(profile.avatar_url) && profile.avatar_url.length > 0 
                  ? profile.avatar_url[0] 
                  : profile.avatar_url || null,
                tagline: profile.tagline || '',
                location: profile.location || '',
                status: profile.status || null,
              }}
              viewingOwnProfile={user.id === userId}
              friendStatus={friendshipStatus} 
              onRemoveFriend={() => {
                if (profile) {
                  const friendManagement = document.querySelector('[data-friend-management]');
                  if (friendManagement) {
                    (friendManagement as HTMLElement).click();
                  }
                }
              }}
              onAddFriend={handleAddFriend}
              showAvatar={true}
              onEditProfile={user.id === userId ? () => navigate('/profile/edit') : undefined}
            />
            
            <UserEventsFetcher
              currentUserId={user.id}
              profileUserId={userId}
              friendshipStatus={friendshipStatus}
            >
              {({ currentUserEvents }) => (
                <>
                  <ProfileEventsSection 
                    canViewEvents={canViewEvents}
                    upcomingEvents={upcomingEvents}
                    pastEvents={pastEvents}
                    eventsLoading={eventsLoading}
                    isCurrentUser={user.id === userId}
                    username={profile.username}
                    handleAddFriend={handleAddFriend}
                    friendshipStatus={friendshipStatus}
                  />

                  <div className="hidden" data-friend-management>
                    <FriendManagement
                      profile={profile}
                      currentUserId={user.id}
                      friendshipStatus={friendshipStatus}
                      setFriendshipStatus={setFriendshipStatus}
                      onFriendRemoved={() => navigate('/friends')}
                    />
                  </div>
                </>
              )}
            </UserEventsFetcher>
          </>
        ) : (
          !profileLoading && <ProfileNotFound />
        )}
      </div>
    </ProfileAccessControl>
  );
};

export default UserProfilePage;
