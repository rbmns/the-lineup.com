
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUserEvents } from '@/hooks/useUserEvents';
import { useFriendship } from '@/hooks/useFriendship';
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileEventsSection } from '@/components/profile/ProfileEventsSection';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { Loader2 } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import { isProfileClickable } from '@/utils/friendshipUtils';

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  
  // Determine if viewing own profile
  const isOwnProfile = !userId || userId === user?.id;
  const profileId = isOwnProfile ? user?.id : userId;
  
  // Fetch profile data
  const { profile, loading: profileLoading } = useProfileData(profileId);
  
  // Get friendship status if viewing another user's profile
  const { 
    status: friendshipStatus, 
    sendFriendRequest 
  } = useFriendship(user?.id, userId);
  
  // Fetch user events based on friendship status
  const { 
    upcomingEvents, 
    pastEvents, 
    isLoading: eventsLoading 
  } = useUserEvents(profileId);
  
  // Convert friendshipStatus to compatible type for child components
  // This ensures "requested" is properly handled as "pending"
  const normalizedFriendStatus = friendshipStatus === 'requested' ? 'pending' : 
    (friendshipStatus as 'none' | 'pending' | 'accepted');
  
  // Track page view with friendship status
  useEffect(() => {
    if (profile && !isOwnProfile) {
      trackEvent('profile_view', {
        profile_id: profileId,
        friendship_status: normalizedFriendStatus, // Use normalized status here
        is_own_profile: isOwnProfile
      });
    }
  }, [profile, profileId, normalizedFriendStatus, isOwnProfile]);
  
  // Redirect to login if trying to view own profile but not logged in
  useEffect(() => {
    if (isOwnProfile && !user) {
      navigate('/login');
    }
  }, [isOwnProfile, user, navigate]);

  // Handle adding friend
  const handleAddFriend = async () => {
    if (userId && sendFriendRequest) {
      trackEvent('friend_request_sent', {
        recipient_id: userId
      });
      await sendFriendRequest();
    }
  };

  // Determine if user can view events based on friendship status
  // Use the normalized status here
  const canViewEvents = isOwnProfile || normalizedFriendStatus === 'accepted';
  
  // Determine if the profile is clickable
  // Use the normalized status here
  const canNavigateToProfile = !isOwnProfile && isProfileClickable(normalizedFriendStatus, false);

  if (isOwnProfile && !user) {
    return null; // Will redirect in effect
  }

  if (profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isOwnProfile ? 'My Profile' : `${profile?.username || 'User'}'s Profile`}
      </h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        {isOwnProfile && (
          <div className="mb-4">
            <Link 
              to="/profile/edit" 
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Edit Profile Settings
            </Link>
          </div>
        )}
        
        <div className="space-y-6">
          <ProfileCard 
            profile={profile}
            friendStatus={normalizedFriendStatus}
            onAddFriend={handleAddFriend}
            showActions={!isOwnProfile}
            linkToProfile={canNavigateToProfile}
          />
          
          <ProfileEventsSection 
            canViewEvents={canViewEvents}
            upcomingEvents={upcomingEvents}
            pastEvents={pastEvents}
            eventsLoading={eventsLoading}
            isCurrentUser={isOwnProfile}
            username={profile?.username}
            handleAddFriend={handleAddFriend}
            friendshipStatus={normalizedFriendStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
