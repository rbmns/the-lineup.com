import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Fix the friends data handling in the Friends component
export default function Friends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [pendingSent, setPendingSent] = useState<UserProfile[]>([]);
  const [pendingReceived, setPendingReceived] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add proper typing for user profile data
  const processProfileData = (data: any[]): UserProfile[] => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      id: item.id,
      username: item.username,
      email: item.email || '',
      avatar_url: item.avatar_url,
      location: item.location || null,
      status: item.status || null,
      tagline: item.tagline || null,
      location_category: item.location_category || null,
    }));
  };
  
  const handleAcceptRequest = async (friendId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'Accepted' })
        .eq('user_id', friendId)
        .eq('friend_id', user?.id);
      
      if (error) throw error;
      
      setPendingReceived(prev => prev.filter(friend => friend.id !== friendId));
      setFriends(prev => [...prev, pendingReceived.find(friend => friend.id === friendId)] as UserProfile[]);
      
      toast({
        title: 'Success',
        description: 'Friend request accepted!',
      });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept friend request.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRejectRequest = async (friendId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', friendId)
        .eq('friend_id', user?.id);
      
      if (error) throw error;
      
      setPendingReceived(prev => prev.filter(friend => friend.id !== friendId));
      
      toast({
        title: 'Success',
        description: 'Friend request rejected.',
      });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject friend request.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelRequest = async (friendId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', user?.id)
        .eq('friend_id', friendId);
      
      if (error) throw error;
      
      setPendingSent(prev => prev.filter(friend => friend.id !== friendId));
      
      toast({
        title: 'Success',
        description: 'Friend request cancelled.',
      });
    } catch (error) {
      console.error('Error cancelling friend request:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel friend request.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveFriend = async (friendId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('friendships')
        .delete()
        .or(`(user_id.eq.${user?.id},friend_id.eq.${friendId}),(user_id.eq.${friendId},friend_id.eq.${user?.id})`);
      
      if (error) throw error;
      
      setFriends(prev => prev.filter(friend => friend.id !== friendId));
      
      toast({
        title: 'Success',
        description: 'Friend removed.',
      });
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove friend.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fix the friends data handling
  useEffect(() => {
    const loadFriends = async () => {
      try {
        setIsLoading(true);
        
        // Fetch accepted friends
        const { data: acceptedFriendsData, error: acceptedError } = await supabase
          .from('friendships')
          .select(`
            friend:profiles!friendships_friend_id_fkey(id, username, avatar_url, status)
          `)
          .eq('user_id', user?.id)
          .eq('status', 'Accepted');
        
        if (acceptedError) throw acceptedError;
        
        // Fetch pending sent requests
        const { data: pendingSentData, error: pendingSentError } = await supabase
          .from('friendships')
          .select(`
            friend:profiles!friendships_friend_id_fkey(id, username, avatar_url, status)
          `)
          .eq('user_id', user?.id)
          .eq('status', 'Pending');
        
        if (pendingSentError) throw pendingSentError;
        
        // Fetch pending received requests
        const { data: pendingReceivedData, error: pendingReceivedError } = await supabase
          .from('friendships')
          .select(`
            user:profiles!friendships_user_id_fkey(id, username, avatar_url, status)
          `)
          .eq('friend_id', user?.id)
          .eq('status', 'Pending');
        
        if (pendingReceivedError) throw pendingReceivedError;
        
        // Process the friends data to match UserProfile type
        const processedAccepted = acceptedFriendsData?.map(item => item.friend) || [];
        const processedPendingSent = pendingSentData?.map(item => item.friend) || [];
        const processedPendingReceived = pendingReceivedData?.map(item => item.user) || [];
        
        // Convert to proper UserProfile objects
        setFriends(processProfileData(processedAccepted));
        setPendingSent(processProfileData(processedPendingSent));
        setPendingReceived(processProfileData(processedPendingReceived));
        
      } catch (error) {
        console.error('Error loading friends:', error);
        toast({
          title: 'Error',
          description: 'Failed to load friends data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadFriends();
    }
  }, [user, supabase, toast]);
  
  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPendingSent = pendingSent.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPendingReceived = pendingReceived.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Friends</h1>
        <div className="mb-4">
          <Input type="text" placeholder="Search friends..." disabled />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Friends</CardTitle>
            <CardDescription>These are your current friends.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Sent Requests</CardTitle>
            <CardDescription>These are the friend requests you have sent.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Received Requests</CardTitle>
            <CardDescription>These are the friend requests you have received.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Friends</CardTitle>
          <CardDescription>These are your current friends.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {filteredFriends.length > 0 ? (
            filteredFriends.map(friend => (
              <div key={friend.id} className="flex items-center space-x-4">
                <Link to={`/users/${friend.id}`}>
                  <Avatar>
                    <AvatarImage src={friend.avatar_url ? friend.avatar_url[0] : ''} alt={friend.username} />
                    <AvatarFallback>{friend.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{friend.username}</p>
                  <p className="text-sm text-muted-foreground">{friend.status || 'No status'}</p>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" size="sm" onClick={() => handleRemoveFriend(friend.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No friends found.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Sent Requests</CardTitle>
          <CardDescription>These are the friend requests you have sent.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {filteredPendingSent.length > 0 ? (
            filteredPendingSent.map(friend => (
              <div key={friend.id} className="flex items-center space-x-4">
                <Link to={`/users/${friend.id}`}>
                  <Avatar>
                    <AvatarImage src={friend.avatar_url ? friend.avatar_url[0] : ''} alt={friend.username} />
                    <AvatarFallback>{friend.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{friend.username}</p>
                  <p className="text-sm text-muted-foreground">{friend.status || 'No status'}</p>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" size="sm" onClick={() => handleCancelRequest(friend.id)}>
                    Cancel Request
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No pending sent requests.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Received Requests</CardTitle>
          <CardDescription>These are the friend requests you have received.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {filteredPendingReceived.length > 0 ? (
            filteredPendingReceived.map(friend => (
              <div key={friend.id} className="flex items-center space-x-4">
                <Link to={`/users/${friend.id}`}>
                  <Avatar>
                    <AvatarImage src={friend.avatar_url ? friend.avatar_url[0] : ''} alt={friend.username} />
                    <AvatarFallback>{friend.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{friend.username}</p>
                  <p className="text-sm text-muted-foreground">{friend.status || 'No status'}</p>
                </div>
                <div className="ml-auto flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleAcceptRequest(friend.id)}>
                    Accept
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRejectRequest(friend.id)}>
                    Reject
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No pending received requests.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
