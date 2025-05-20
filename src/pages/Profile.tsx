
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import { useProfilePageMeta } from '@/hooks/useProfilePageMeta';
import { ProfileNotFound } from '@/components/profile/ProfileNotFound';
import { ProfileLoading } from '@/components/profile/ProfileLoading';
import { BackButton } from '@/components/profile/BackButton';
import { ProfileHeaderContainer } from '@/components/profile/ProfileHeaderContainer';
import { ProfileEventsContainer } from '@/components/profile/ProfileEventsContainer';
import { ProfileStatusManager } from '@/components/profile/ProfileStatusManager';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOwnProfile, setIsOwnProfile] = useState(true); // Default to true for /profile route
  const [isFriend, setIsFriend] = useState<boolean | null>(null);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [friendRequestReceived, setFriendRequestReceived] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  
  // Use the user's ID directly when on the /profile route (no username param)
  const profileIdentifier = username || (user?.id || null);
  
  const { 
    profile, 
    loading, 
    error, 
    isNotFound,
    refreshProfile
  } = useProfileData(profileIdentifier);
  
  // Set up page meta tags and canonical URL
  useProfilePageMeta(username, user, profile?.username);
  
  useEffect(() => {
    // If no user is logged in, redirect to login page
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (profile?.id) {
      setProfileId(profile.id);
      // When on /profile route or when username param matches current user
      setIsOwnProfile(username ? user.id === profile.id : true);
    }
  }, [user, profile?.id, username, navigate]);
  
  const handleUpdateFriendship = (status: string) => {
    setIsFriend(status === 'accepted');
    setFriendRequestSent(status === 'requested');
    setFriendRequestReceived(status === 'pending');
  };
  
  const handleStatusUpdate = (friendStatus: boolean | null, sentRequest: boolean, receivedRequest: boolean) => {
    setIsFriend(friendStatus);
    setFriendRequestSent(sentRequest);
    setFriendRequestReceived(receivedRequest);
  };
  
  const handleUpdateBlockStatus = (blocked: boolean) => {
    setIsBlocked(blocked);
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return <ProfileLoading />;
  }
  
  // If we're on /profile route and not logged in, we'll redirect in useEffect
  if (!user) {
    return null;
  }
  
  if (isNotFound || !profile) {
    return <ProfileNotFound />;
  }
  
  return (
    <div className="container mx-auto mt-8">
      <BackButton onClick={handleGoBack} />
      
      {/* Profile Header with Friend Management */}
      <ProfileHeaderContainer 
        profile={profile}
        isOwnProfile={isOwnProfile}
        user={user}
        profileId={profileId}
        refreshProfile={refreshProfile}
        onUpdateFriendship={handleUpdateFriendship}
        onUpdateBlockStatus={handleUpdateBlockStatus}
      />
      
      {/* Friend Status Manager (non-visual component) */}
      <ProfileStatusManager
        userId={user?.id}
        profileId={profileId}
        isOwnProfile={isOwnProfile}
        onUpdateFriendship={handleStatusUpdate}
        onUpdateBlockStatus={handleUpdateBlockStatus}
      />
      
      {/* Events Content */}
      <ProfileEventsContainer 
        profileId={profileId}
        profile={profile}
        isLoading={loading}
      />
    </div>
  );
};

export default Profile;
