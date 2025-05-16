
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import { useCanonical } from '@/hooks/useCanonical';
import { useProfileFriendship } from '@/hooks/useProfileFriendship';
import { useProfileEvents } from '@/hooks/useProfileEvents';
import { UserProfileContent } from '@/components/profile/UserProfileContent';
import { ProfileNotFound } from '@/components/profile/ProfileNotFound';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileLoading } from '@/components/profile/ProfileLoading';
import { FriendManagement } from '@/components/profile/FriendManagement';
import { ProfileAccessControl } from '@/components/profile/ProfileAccessControl';
import { BackButton } from '@/components/profile/BackButton';
import { filterPastEvents, sortEventsByDate } from '@/utils/date-filtering';
 
const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  
  const { 
    profile, 
    loading, 
    error, 
    isNotFound,
    refreshProfile
  } = useProfileData(username);
  
  const {
    events,
    loadingEvents
  } = useProfileEvents(profileId);

  const {
    isFriend,
    friendRequestSent,
    friendRequestReceived,
    isBlocked,
    friendshipStatus,
    setIsFriend,
    setFriendRequestSent,
    setFriendRequestReceived,
    setIsBlocked,
    setFriendshipStatus
  } = useProfileFriendship(user?.id, profileId, isOwnProfile);
  
  // Add canonical URL for SEO - providing the username as required parameter
  useCanonical(username ? `/profile/${username}` : '/profile', profile?.username);
  
  useEffect(() => {
    if (profile?.id) {
      setProfileId(profile.id);
      setIsOwnProfile(user?.id === profile.id);
    }
  }, [user?.id, profile?.id]);
  
  useEffect(() => {
    if (username) {
      document.title = `@${username} | Events`;
    }
  }, [username]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return <ProfileLoading />;
  }
  
  if (isNotFound || !profile) {
    return <ProfileNotFound />;
  }
  
  const pastEvents = filterPastEvents(events);
  const sortedPastEvents = sortEventsByDate(pastEvents);
  
  return (
    <div className="container mx-auto mt-8">
      <BackButton onClick={handleGoBack} />
      
      <ProfileHeader profile={profile} />
      
      {!isOwnProfile && user && profileId && (
        <FriendManagement
          profile={profile}
          currentUserId={user.id}
          friendshipStatus={friendshipStatus}
          setFriendshipStatus={setFriendshipStatus}
          onUpdateFriendship={(status) => {
            setIsFriend(status === 'accepted');
            setFriendRequestSent(status === 'requested');
            setFriendRequestReceived(status === 'pending');
          }}
          onBlock={(blocked) => setIsBlocked(blocked)}
          refreshProfile={refreshProfile}
        />
      )}
      
      {isOwnProfile && user && (
        <ProfileAccessControl
          profile={profile}
          user={user}
          userId={user.id}
          loading={false}
          profileLoading={loading}
          isAuthenticated={!!user}
          friendshipStatus={friendshipStatus}
        >
          <div>Profile content for authenticated user</div>
        </ProfileAccessControl>
      )}
      
      <UserProfileContent
        profile={profile}
        pastEvents={sortedPastEvents}
        isLoading={loadingEvents}
      />
    </div>
  );
};

export default Profile;
