import { supabase } from '@/lib/supabase';
import { FriendRequest } from '@/types/friends';
import { UserProfile } from '@/types';

// Function to fetch friend requests for a specific user
export async function fetchPendingRequests(userId: string): Promise<FriendRequest[]> {
  try {
    if (!userId) return [];
    
    // Get pending friend requests where the user is the receiver
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id, 
        status, 
        created_at,
        user_id,
        friend_id,
        profiles!friendships_user_id_fkey(
          id, 
          username, 
          avatar_url, 
          email, 
          location,
          status,
          tagline
        )
      `)
      .eq('friend_id', userId)
      .eq('status', 'Pending');
    
    if (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
    
    // Map to the correct type
    const requests: FriendRequest[] = data.map(item => ({
      id: item.id,
      status: item.status.toLowerCase() as 'pending' | 'accepted' | 'declined',
      created_at: item.created_at,
      user_id: item.user_id,
      friend_id: item.friend_id,
      sender_id: item.user_id,
      receiver_id: item.friend_id,
      profile: item.profiles as UserProfile
    }));
    
    return requests;
  } catch (error) {
    console.error('Error in fetchPendingRequests:', error);
    return [];
  }
}

// Function to check for recently accepted friend requests
export const checkRecentlyAcceptedRequests = async (userId: string): Promise<void> => {
  if (!userId) return;
  
  try {
    const { data: acceptedRequests, error: acceptedError } = await supabase
      .from('friendships')
      .select('*, profiles!friendships_friend_id_fkey(*)')
      .eq('user_id', userId)
      .eq('status', 'Accepted')
      .order('updated_at', { ascending: false })
      .limit(5);  // Only check recent acceptances
      
    if (acceptedError) throw acceptedError;
    
    // Check for newly accepted requests (within last 5 minutes)
    if (acceptedRequests?.length) {
      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
      
      // Filter to only recently accepted requests
      const recentlyAccepted = acceptedRequests.filter(req => {
        const updatedAt = new Date(req.updated_at);
        return updatedAt > fiveMinutesAgo;
      });
      
      // Show notification for each recently accepted request
      recentlyAccepted.forEach(req => {
        const friendProfile = req.profiles;
        if (friendProfile?.username) {
          toast({
            title: "Friend request accepted",
            description: `${friendProfile.username} has accepted your friend request`
          });
        }
      });
    }
  } catch (err) {
    console.error('Error checking recently accepted requests:', err);
  }
};

// Function to accept a friend request
export const acceptFriendRequest = async (requestId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'Accepted' })
      .eq('id', requestId);
    
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error accepting friend request:', err);
    toast({
      title: "Error",
      description: "Failed to accept friend request",
      variant: "destructive"
    });
    return false;
  }
};

// Function to decline a friend request
export const declineFriendRequest = async (requestId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'Removed' })
      .eq('id', requestId);
    
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error declining friend request:', err);
    toast({
      title: "Error",
      description: "Failed to decline friend request",
      variant: "destructive"
    });
    return false;
  }
};

// Function to set up real-time friendship updates
export const setupFriendshipSubscription = (
  userId: string, 
  onAccepted: () => void
): (() => void) => {
  const subscription = supabase
    .channel('friendship-status-changes')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'friendships',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      // If status changed to Accepted, show notification
      if (payload.new && payload.new.status === 'Accepted') {
        // Fetch the friend's profile to get their username
        supabase
          .from('profiles')
          .select('username')
          .eq('id', payload.new.friend_id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              toast({
                title: "Friend request accepted",
                description: `${data.username} has accepted your friend request`
              });
            }
            
            // Call the callback to refresh requests
            onAccepted();
          });
      }
    })
    .subscribe();
    
  return () => {
    subscription.unsubscribe();
  };
};
