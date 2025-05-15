import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  created_at: string;
  updated_at: string;
  profile?: {
    id: string;
    username: string;
    avatar_url?: string[] | null;
    email: string;
  };
}

export const useFriendship = () => {
  const [friendRequests, setFriendRequests] = useState<Friendship[]>([]);
  const [sentRequests, setSentRequests] = useState<Friendship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { user } = useAuth();
  
  const refreshRequests = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch incoming friend requests
      const { data: incomingRequests, error: incomingError } = await supabase
        .from('friendships')
        .select(`
          id, 
          user_id, 
          friend_id, 
          status, 
          created_at, 
          updated_at
        `)
        .eq('friend_id', user.id)
        .eq('status', 'Pending');
      
      if (incomingError) throw incomingError;
      
      // Fetch profiles for the users who sent the requests
      if (incomingRequests && incomingRequests.length > 0) {
        const senderIds = incomingRequests.map(req => req.user_id);
        
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, email')
          .in('id', senderIds);
          
        if (profileError) throw profileError;
        
        // Attach profiles to requests
        const requestsWithProfiles = incomingRequests.map(req => {
          const profile = profiles?.find(p => p.id === req.user_id);
          return {
            ...req,
            profile
          };
        });
        
        setFriendRequests(requestsWithProfiles);
      } else {
        setFriendRequests([]);
      }
      
      // Fetch sent friend requests
      const { data: sent, error: sentError } = await supabase
        .from('friendships')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'Pending')
        .order('created_at', { ascending: false });
        
      if (sentError) throw sentError;
      setSentRequests(sent || []);
      
    } catch (err: any) {
      console.error('Error fetching friend requests:', err);
      setError(err.message || 'Failed to fetch friend requests.');
      toast({
        title: 'Error fetching friend requests',
        description: err.message || 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user?.id) {
      refreshRequests();
    } else {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  // Method for accepting friend requests
  const acceptFriendRequest = async (friendshipId: string) => {
    try {
      setProcessingId(friendshipId);
      
      // Get friendship details including user profile before updating status
      const { data: friendship, error: getError } = await supabase
        .from('friendships')
        .select('*, user_id')
        .eq('id', friendshipId)
        .single();

      if (getError) throw getError;

      const { data, error } = await supabase
        .from('friendships')
        .update({ status: 'Accepted', updated_at: new Date().toISOString() })
        .eq('id', friendshipId)
        .select();
      
      if (error) throw error;
      
      // Refresh friend requests after accepting one
      if (data && data.length > 0) {
        refreshRequests();
        
        // No toast notification when accepting a friend request
        // The UI will update to show they are now friends
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error accepting friend request:', error);
      toast({
        title: 'Error accepting friend request',
        description: error.message || 'Please try again later.',
        variant: 'destructive'
      });
      return { success: false, error };
    } finally {
      setProcessingId(null);
    }
  };
  
  // Method for declining friend requests
  const declineFriendRequest = async (friendshipId: string) => {
    try {
      setProcessingId(friendshipId);
      
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'Declined', updated_at: new Date().toISOString() })
        .eq('id', friendshipId);
      
      if (error) throw error;
      
      refreshRequests();
      
      // No toast notification for declining a request
      
      return { success: true };
    } catch (error: any) {
      console.error('Error declining friend request:', error);
      toast({
        title: 'Error declining friend request',
        description: error.message || 'Please try again later.',
        variant: 'destructive'
      });
      return { success: false, error };
    } finally {
      setProcessingId(null);
    }
  };
  
  // Method for sending friend requests
  const initiateFriendRequest = async (friendId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('friendships')
        .insert({ 
          user_id: user?.id,
          friend_id: friendId,
          status: 'Pending',
          updated_at: new Date().toISOString() 
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Friend request sent",
        description: "Your friend request has been sent.",
      });
      
      refreshRequests();
      return true;
    } catch (error: any) {
      console.error('Error sending friend request:', error);
      toast({
        title: 'Error sending friend request',
        description: error.message || 'Please try again later.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Method for canceling friend requests
  const handleCancelRequest = async (friendshipId: string) => {
    try {
      setProcessingId(friendshipId);
      
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);
      
      if (error) throw error;
      
      refreshRequests();
      toast({
        title: "Friend request cancelled",
        description: "You have cancelled the friend request.",
      });
      return { success: true };
    } catch (error: any) {
      console.error('Error cancelling friend request:', error);
      toast({
        title: 'Error cancelling friend request',
        description: error.message || 'Please try again later.',
        variant: 'destructive'
      });
      return { success: false, error };
    } finally {
      setProcessingId(null);
    }
  };
  
  // For backward compatibility
  const handleAcceptRequest = acceptFriendRequest;
  const handleDeclineRequest = declineFriendRequest;
  const handleRejectRequest = declineFriendRequest;
  
  return {
    friendRequests,
    sentRequests,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    error,
    processingId,
    refreshRequests,
    handleAcceptRequest,
    handleRejectRequest,
    handleDeclineRequest,
    handleCancelRequest,
    // Add the new function names that match what the components expect
    initiateFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
  };
};
