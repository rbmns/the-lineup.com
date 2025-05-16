
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useProfileData } from '@/hooks/useProfileData';
import { useCanonical } from '@/hooks/useCanonical';
import { UserProfileContent } from '@/components/profile/UserProfileContent';
import { ProfileNotFound } from '@/components/profile/ProfileNotFound';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileLoading } from '@/components/profile/ProfileLoading';
import { FriendManagement } from '@/components/profile/FriendManagement';
import { ProfileAccessControl } from '@/components/profile/ProfileAccessControl';
import { BackButton } from '@/components/profile/BackButton';
import { filterPastEvents, sortEventsByDate } from '@/utils/date-filtering';
import { checkRealTimeFriendshipStatus } from '@/utils/friendshipUtils';
 
const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [isFriend, setIsFriend] = useState<boolean | null>(null);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [friendRequestReceived, setFriendRequestReceived] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'pending' | 'accepted'>('none');
  
  const { 
    profile, 
    loading, 
    error, 
    isNotFound,
    fetchProfileData,
    refreshProfile
  } = useProfileData(username);
  
  // Add canonical URL for SEO - providing the username as required parameter
  useCanonical(username ? `/profile/${username}` : '/profile', profile?.username);
  
  useEffect(() => {
    if (profile?.id) {
      setProfileId(profile.id);
      setIsOwnProfile(user?.id === profile.id);
    }
  }, [user?.id, profile?.id]);
  
  useEffect(() => {
    if (profileId) {
      fetchEvents(profileId);
      if (user?.id && !isOwnProfile) {
        checkFriendshipStatus(user.id, profileId);
        checkIfBlocked(user.id, profileId);
      }
    }
  }, [profileId, user?.id, isOwnProfile]);
  
  useEffect(() => {
    if (username) {
      document.title = `@${username} | Events`;
    }
  }, [username]);
  
  // Update friendship status from the database
  useEffect(() => {
    const updateFriendshipStatus = async () => {
      if (user?.id && profileId && !isOwnProfile) {
        const status = await checkRealTimeFriendshipStatus(user.id, profileId);
        setFriendshipStatus(status);
      }
    };
    
    updateFriendshipStatus();
  }, [user?.id, profileId, isOwnProfile]);
  
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
  
  const checkFriendshipStatus = async (userId: string, profileId: string) => {
    try {
      // Check if a friend request has been sent by the current user
      const { data: sentRequest, error: sentError } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('sender_id', userId)
        .eq('receiver_id', profileId)
        .single();
      
      if (sentError && sentError.code !== 'PGRST116') {
        console.error('Error checking sent friend request:', sentError);
      } else if (sentRequest) {
        setFriendRequestSent(true);
      }
      
      // Check if a friend request has been received by the current user
      const { data: receivedRequest, error: receivedError } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('sender_id', profileId)
        .eq('receiver_id', userId)
        .single();
      
      if (receivedError && receivedError.code !== 'PGRST116') {
        console.error('Error checking received friend request:', receivedError);
      } else if (receivedRequest) {
        setFriendRequestReceived(true);
      }
      
      // Check if the users are already friends
      const { data: friendship, error: friendshipError } = await supabase
        .from('friends')
        .select('*')
        .or(`user_id.eq.${userId}, friend_id.eq.${userId}`)
        .or(`user_id.eq.${profileId}, friend_id.eq.${profileId}`);
      
      if (friendshipError) {
        console.error('Error checking friendship:', friendshipError);
      } else {
        const areFriends = friendship && friendship.some(record =>
          (record.user_id === userId && record.friend_id === profileId) ||
          (record.user_id === profileId && record.friend_id === userId)
        );
        setIsFriend(areFriends);
      }
    } catch (error) {
      console.error('Error checking friendship status:', error);
    }
  };
  
  const checkIfBlocked = async (userId: string, profileId: string) => {
    try {
      const { data: block, error: blockError } = await supabase
        .from('blocks')
        .select('*')
        .eq('blocker_id', userId)
        .eq('blocked_id', profileId)
        .single();
      
      if (blockError && blockError.code !== 'PGRST116') {
        console.error('Error checking block status:', blockError);
      } else if (block) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    } catch (error) {
      console.error('Error checking block status:', error);
    }
  };
  
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
      
      <ProfileHeader
        profile={profile}
      />
      
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
