import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, UserPlus, UserMinus, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useFriendship } from '@/hooks/useFriendship';
import { UserProfile as UserProfileType } from '@/types'; // Import as a type alias

const Friends = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [friends, setFriends] = useState<any[] | null>(null);
  const [friendRequests, setFriendRequests] = useState<any[] | null>(null);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const navigate = useNavigate();

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
              avatar_url: Array.isArray(friendProfile.avatar_url) && friendProfile.avatar_url.length > 0 ? friendProfile.avatar_url[0] : null,
              email: friendProfile.email
            }
          };
        }).filter(friendship => friendship?.profile?.id !== user.id).filter(Boolean);

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
              avatar_url: Array.isArray(requestProfile.avatar_url) && requestProfile.avatar_url.length > 0 ? requestProfile.avatar_url[0] : null,
              email: requestProfile.email
            }
          };
        }).filter(Boolean);

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

  const handleAcceptFriendRequest = async (friendshipId: string) => {
    if (!user?.id) return;

    try {
      const { acceptFriendRequest } = useFriendship();
      const success = await acceptFriendRequest(friendshipId);

      if (success) {
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
          }).filter(friendship => friendship?.profile?.id !== user.id).filter(Boolean);

          setFriends(friendsList);
        };
        fetchFriendsAgain();
      } else {
        toast({
          title: "Error",
          description: "Failed to accept friend request.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to accept friend request.",
        variant: "destructive",
      });
    }
  };

  const handleRejectFriendRequest = async (friendshipId: string) => {
    if (!user?.id) return;

    try {
      const { rejectFriendRequest } = useFriendship();
      const success = await rejectFriendRequest(friendshipId);

      if (success) {
        toast({
          title: "Success",
          description: "Friend request rejected.",
        });
        // Optimistically update the UI
        setFriendRequests(prevRequests => prevRequests?.filter(request => request.id !== friendshipId) || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to reject friend request.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to reject friend request.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!user?.id) return;

    try {
      const { removeFriend } = useFriendship();
      const success = await removeFriend(friendId);

      if (success) {
        toast({
          title: "Success",
          description: "Friend removed.",
        });
        // Optimistically update the UI
        setFriends(prevFriends => prevFriends?.filter(friend => friend?.profile?.id !== friendId) || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to remove friend.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast({
        title: "Error",
        description: "Failed to remove friend.",
        variant: "destructive",
      });
    }
  };

  const formattedRequests = friendRequests?.map(request => ({
    id: request.id,
    created_at: request.created_at,
    user_id: request.user_id,
    friend_id: request.friend_id,
    status: request.status,
    profile: {
      id: request.profile.id,
      username: request.profile.username,
      avatar_url: Array.isArray(request.profile.avatar_url) && request.profile.avatar_url.length > 0 ? request.profile.avatar_url[0] : null,
      email: request.profile.email
    }
  })) || [];

  return (
    <FriendsTabContent
      friends={friends as UserProfileType[]} // Cast to explicit type
      loading={friendsLoading || authLoading}
      requests={formattedRequests}
      onAcceptRequest={handleAcceptFriendRequest}
      onRejectRequest={handleRejectFriendRequest}
      onRemoveFriend={handleRemoveFriend}
    />
  );
};

interface FriendsTabContentProps {
  friends: UserProfileType[] | null;
  loading: boolean;
  requests: any[] | null;
  onAcceptRequest: (friendshipId: string) => Promise<void>;
  onRejectRequest: (friendshipId: string) => Promise<void>;
  onRemoveFriend: (friendId: string) => Promise<void>;
}

const FriendsTabContent: React.FC<FriendsTabContentProps> = ({
  friends,
  loading,
  requests,
  onAcceptRequest,
  onRejectRequest,
  onRemoveFriend
}) => {
  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple" />
          <p className="text-gray-600">Loading your friends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-6">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>

      {requests && requests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Friend Requests</h2>
          <div className="space-y-3">
            {requests.map(request => (
              <Card key={request.id} className="border border-gray-200 shadow-sm">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={request.profile.avatar_url || ""} alt={request.profile.username} />
                      <AvatarFallback>{request.profile.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.profile.username}</p>
                      <p className="text-gray-500 text-sm">{request.profile.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onAcceptRequest(request.id)}>
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onRejectRequest(request.id)}>
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-3">Your Friends</h2>
        {friends && friends.length > 0 ? (
          <div className="space-y-3">
            {friends.map(friend => (
              <Card key={friend?.profile?.id} className="border border-gray-200 shadow-sm">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={friend?.profile?.avatar_url || ""} alt={friend?.profile?.username} />
                      <AvatarFallback>{friend?.profile?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{friend?.profile?.username}</p>
                      <p className="text-gray-500 text-sm">{friend?.profile?.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onRemoveFriend(friend?.profile?.id)}>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-gray-500">No friends yet. Start connecting with people!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Friends;
