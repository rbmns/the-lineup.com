
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, UserPlus, UserMinus, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useFriendship, Friendship } from '@/hooks/useFriendship';
import { UserProfile } from '@/types'; // Import as a type alias
import { FriendsTabContent } from '@/components/friends/FriendsTabContent';
import { FriendRequestWithProfile } from '@/types/friends-extended';

// Define a type for the friend item that includes the profile
interface FriendItem {
  id: string;
  created_at: string;
  user_id: string;
  friend_id: string;
  status: string;
  profile: {
    id: string;
    username: string;
    avatar_url: string[] | null;  // Changed to array to match profile structure
    email: string;
  };
}

const Friends = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [friends, setFriends] = useState<FriendItem[] | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendItem[] | null>(null);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const navigate = useNavigate();
  const { 
    acceptFriendRequest, 
    declineFriendRequest, 
    removeFriend 
  } = useFriendship();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?.id) return;

      setFriendsLoading(true);
      try {
        // Fetch accepted friendships where the current user is either the user or the friend
        const { data: friendships, error: friendsError } = await supabase
          .from('friendships')
          .select(`
            id,
            created_at,
            user_id,
            friend_id,
            status,
            profiles(
              id,
              username,
              avatar_url,
              email
            )
          `)
          .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
          .eq('status', 'Accepted');

        if (friendsError) {
          console.error("Error fetching friends:", friendsError);
          toast({
            title: "Error",
            description: "Failed to load friends.",
            variant: "destructive",
          });
          return;
        }

        // Filter out the current user's profile from the friends list
        const friendsList = friendships?.map(friendship => {
          const friendProfile = friendship.profiles;
          if (!friendProfile) return null;

          return {
            id: friendship.id,
            created_at: friendship.created_at,
            user_id: friendship.user_id,
            friend_id: friendship.friend_id,
            status: friendship.status,
            profile: {
              id: friendProfile.id,
              username: friendProfile.username,
              avatar_url: friendProfile.avatar_url, // Keep as array as it comes from the database
              email: friendProfile.email
            }
          };
        }).filter(friendship => friendship?.profile?.id !== user.id).filter(Boolean) as FriendItem[];

        setFriends(friendsList);

        // Fetch friend requests where the current user is the recipient and the status is pending
        const { data: requests, error: requestsError } = await supabase
          .from('friendships')
          .select(`
            id,
            created_at,
            user_id,
            friend_id,
            status,
            profiles(
              id,
              username,
              avatar_url,
              email
            )
          `)
          .eq('friend_id', user.id)
          .eq('status', 'Pending');

        if (requestsError) {
          console.error("Error fetching friend requests:", requestsError);
          toast({
            title: "Error",
            description: "Failed to load friend requests.",
            variant: "destructive",
          });
          return;
        }

        // Format friend requests to match the structure of friends
        const formattedRequests = requests?.map(request => {
          const requestProfile = request.profiles;
          if (!requestProfile) return null;

          return {
            id: request.id,
            created_at: request.created_at,
            user_id: request.user_id,
            friend_id: request.friend_id,
            status: request.status,
            profile: {
              id: requestProfile.id,
              username: requestProfile.username,
              avatar_url: requestProfile.avatar_url, // Keep as array as it comes from the database
              email: requestProfile.email
            }
          };
        }).filter(Boolean) as FriendItem[];

        setFriendRequests(formattedRequests);
      } catch (error) {
        console.error("Error in fetchFriends:", error);
        toast({
          title: "Error",
          description: "Failed to load friends and requests.",
          variant: "destructive",
        });
      } finally {
        setFriendsLoading(false);
      }
    };

    if (user?.id) {
      fetchFriends();
    }
  }, [user?.id]);

  const handleAcceptFriendRequest = async (friendshipId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const result = await acceptFriendRequest(friendshipId);

      if (result?.success) {
        toast({
          title: "Success",
          description: "Friend request accepted!",
        });
        // Optimistically update the UI
        setFriendRequests(prevRequests => prevRequests?.filter(request => request.id !== friendshipId) || []);
        // Fetch friends again to update the friends list
        const fetchFriendsAgain = async () => {
          const { data: friendships, error: friendsError } = await supabase
            .from('friendships')
            .select(`
              id,
              created_at,
              user_id,
              friend_id,
              status,
              profiles(
                id,
                username,
                avatar_url,
                email
              )
            `)
            .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
            .eq('status', 'Accepted');

          if (friendsError) {
            console.error("Error fetching friends:", friendsError);
            toast({
              title: "Error",
              description: "Failed to load friends.",
              variant: "destructive",
            });
            return;
          }

          // Filter out the current user's profile from the friends list
          const friendsList = friendships?.map(friendship => {
            const friendProfile = friendship.profiles;
            if (!friendProfile) return null;

            return {
              id: friendship.id,
              created_at: friendship.created_at,
              user_id: friendship.user_id,
              friend_id: friendship.friend_id,
              status: friendship.status,
              profile: {
                id: friendProfile.id,
                username: friendProfile.username,
                avatar_url: Array.isArray(friendProfile.avatar_url) && friendProfile.avatar_url.length > 0 ? friendProfile.avatar_url[0] : null,
                email: friendProfile.email
              }
            };
          }).filter(friendship => friendship?.profile?.id !== user.id).filter(Boolean) as FriendItem[];

          setFriends(friendsList);
        };
        fetchFriendsAgain();
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to accept friend request.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to accept friend request.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleRejectFriendRequest = async (friendshipId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const result = await declineFriendRequest(friendshipId);

      if (result?.success) {
        toast({
          title: "Success",
          description: "Friend request rejected.",
        });
        // Optimistically update the UI
        setFriendRequests(prevRequests => prevRequests?.filter(request => request.id !== friendshipId) || []);
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to reject friend request.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to reject friend request.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleRemoveFriend = async (friendId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const success = await removeFriend(friendId);

      if (success) {
        toast({
          title: "Success",
          description: "Friend removed.",
        });
        // Optimistically update the UI
        setFriends(prevFriends => prevFriends?.filter(friend => friend.profile.id !== friendId) || []);
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to remove friend.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast({
        title: "Error",
        description: "Failed to remove friend.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Convert friends and requests to appropriate format for FriendsTabContent
  const formattedFriends = friends?.map(friend => ({
    id: friend.profile.id,
    username: friend.profile.username,
    avatar_url: friend.profile.avatar_url, // This stays as an array
    email: friend.profile.email,
    location: null,
    status: null,
    tagline: null,
    location_category: null
  })) || [];

  const formattedRequests = friendRequests?.map(request => ({
    id: request.id,
    created_at: request.created_at,
    user_id: request.user_id,
    friend_id: request.friend_id,
    status: request.status,
    profile: {
      id: request.profile.id,
      username: request.profile.username,
      avatar_url: request.profile.avatar_url, // This stays as an array
      email: request.profile.email
    }
  })) || [];

  return (
    <FriendsTabContent
      friends={formattedFriends as UserProfile[]}
      loading={friendsLoading || authLoading}
      requests={formattedRequests as FriendRequestWithProfile[]}
      onAcceptRequest={handleAcceptFriendRequest}
      onDeclineRequest={handleRejectFriendRequest}
      showFriendRequests={true}
    />
  );
};

export default Friends;
