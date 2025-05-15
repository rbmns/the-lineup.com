import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Event, UserProfile } from '@/types';
import { UserRsvpedEvents } from './UserRsvpedEvents';
import { ProfileCard } from './ProfileCard';
import { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { sortEventsByDate } from '@/utils/dateUtils';

interface UserProfileContentProps {
  profile: UserProfile | null;
  user?: User | null;
  userId: string;
  canViewEvents: boolean;
  friendshipStatus: string;
  handleAddFriend: () => void;
  upcomingEvents?: Event[];
  pastEvents?: Event[];
  eventsLoading?: boolean;
  showProfileCard?: boolean;
  currentUserEvents?: Event[];
}

export const UserProfileContent: React.FC<UserProfileContentProps> = ({
  profile,
  user,
  userId,
  canViewEvents,
  friendshipStatus,
  handleAddFriend,
  upcomingEvents = [],
  pastEvents = [],
  eventsLoading = false,
  showProfileCard = true,
  currentUserEvents = []
}) => {
  const navigate = useNavigate();
  const isOwnProfile = user?.id === userId;

  // Find matching RSVPs between current user and friend
  const matchingRsvps = useMemo(() => {
    if (isOwnProfile || !canViewEvents || !user) return [];
    
    return upcomingEvents.filter(friendEvent => 
      currentUserEvents.some(userEvent => 
        userEvent.id === friendEvent.id && 
        (userEvent.rsvp_status === friendEvent.rsvp_status || 
         (userEvent.rsvp_status && friendEvent.rsvp_status))
      )
    );
  }, [isOwnProfile, canViewEvents, upcomingEvents, currentUserEvents, user]);

  // Convert string friendshipStatus to the expected type for ProfileCard
  const getFriendStatus = (): 'none' | 'pending' | 'accepted' => {
    if (friendshipStatus === 'accepted') return 'accepted';
    if (friendshipStatus === 'pending') return 'pending';
    return 'none';
  };

  // Show loading state while we wait for the profile
  if (!user) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-3" />
          <p className="text-gray-500">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Profile not available or still loading</p>
        <p className="text-gray-400 text-sm mb-4">User ID: {userId}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    );
  }

  // Combine events with proper ordering
  const allEvents = sortEventsByDate([...(upcomingEvents || []), ...(pastEvents || [])]);
  
  return (
    <div className="space-y-8">
      {showProfileCard && (
        <ProfileCard 
          profile={profile}
          friendStatus={getFriendStatus()}
          onAddFriend={handleAddFriend}
          showActions={!isOwnProfile}
          linkToProfile={friendshipStatus === 'accepted' || isOwnProfile}
        />
      )}
      
      {canViewEvents && eventsLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mr-2" />
          <span>Loading events...</span>
        </div>
      )}
      
      {canViewEvents && !eventsLoading && (
        <UserRsvpedEvents
          events={allEvents}
          isCurrentUser={isOwnProfile}
          showFriendRsvp={!isOwnProfile}
          friendUsername={profile?.username}
          isLoading={false}
          userId={userId}
          currentUserId={user?.id}
          matchingRsvps={!isOwnProfile ? matchingRsvps : []}
        />
      )}
      
      {!canViewEvents && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            Connect with {profile?.username || 'this user'} to see their events
          </p>
          {!isOwnProfile && user && (
            <Button onClick={handleAddFriend} className="mt-4">
              Add Friend
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
