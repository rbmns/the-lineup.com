import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Friends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [pendingSent, setPendingSent] = useState<UserProfile[]>([]);
  const [pendingReceived, setPendingReceived] = useState<UserProfile[]>([]);
  const [discoveryUsers, setDiscoveryUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('friends');
  
  // Process user profile data
  const processProfileData = (data: any[]): UserProfile[] => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      id: item.id,
      username: item.username || 'User',
      email: item.email || '',
      avatar_url: item.avatar_url,
      location: item.location || null,
      status: item.status || null,
      tagline: item.tagline || null,
      location_category: item.location_category || null,
    }));
  };
  
  const handleAcceptRequest = async (friendId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'Accepted' })
        .eq('user_id', friendId)
        .eq('friend_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Move user from pending received to friends
      const acceptedFriend = pendingReceived.find(friend => friend.id === friendId);
      
      if (acceptedFriend) {
        setPendingReceived(prev => prev.filter(friend => friend.id !== friendId));
        setFriends(prev => [...prev, acceptedFriend]);
        
        toast({
          title: 'Success',
          description: 'Friend request accepted!',
        });
      }
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
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', friendId)
        .eq('friend_id', user.id);
      
      if (error) {
        throw error;
      }
      
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
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', user.id)
        .eq('friend_id', friendId);
      
      if (error) {
        throw error;
      }
      
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
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Delete both friendships records (in both directions)
      const { error } = await supabase
        .from('friendships')
        .delete()
        .or(`(user_id.eq.${user.id},friend_id.eq.${friendId}),(user_id.eq.${friendId},friend_id.eq.${user.id})`);
      
      if (error) {
        throw error;
      }
      
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
  
  const handleSendFriendRequest = async (friendId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to send friend requests.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Check if there's already a friendship record
      const { data: existingRequest } = await supabase
        .from('friendships')
        .select('*')
        .or(`(user_id.eq.${user.id},friend_id.eq.${friendId}),(user_id.eq.${friendId},friend_id.eq.${user.id})`);
      
      if (existingRequest && existingRequest.length > 0) {
        toast({
          title: 'Already Friends',
          description: 'You already have a friendship connection with this user.',
        });
        return;
      }
      
      // Create new friendship request
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'Pending'
        });
      
      if (error) {
        throw error;
      }
      
      // Move user from discovery to pending sent
      const sentFriend = discoveryUsers.find(friend => friend.id === friendId);
      
      if (sentFriend) {
        setDiscoveryUsers(prev => prev.filter(friend => friend.id !== friendId));
        setPendingSent(prev => [...prev, sentFriend]);
        
        toast({
          title: 'Success',
          description: 'Friend request sent!',
        });
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: 'Error',
        description: 'Failed to send friend request.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch friends data
  useEffect(() => {
    const loadFriends = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch accepted friends
        const { data: acceptedFriendsData, error: acceptedError } = await supabase
          .from('friendships')
          .select(`
            friend:profiles!friendships_friend_id_fkey(id, username, avatar_url, status, tagline, location)
          `)
          .eq('user_id', user.id)
          .eq('status', 'Accepted');
        
        if (acceptedError) throw acceptedError;
        
        // Fetch pending sent requests
        const { data: pendingSentData, error: pendingSentError } = await supabase
          .from('friendships')
          .select(`
            friend:profiles!friendships_friend_id_fkey(id, username, avatar_url, status, tagline, location)
          `)
          .eq('user_id', user.id)
          .eq('status', 'Pending');
        
        if (pendingSentError) throw pendingSentError;
        
        // Fetch pending received requests
        const { data: pendingReceivedData, error: pendingReceivedError } = await supabase
          .from('friendships')
          .select(`
            user:profiles!friendships_user_id_fkey(id, username, avatar_url, status, tagline, location)
          `)
          .eq('friend_id', user.id)
          .eq('status', 'Pending');
        
        if (pendingReceivedError) throw pendingReceivedError;
        
        // Fetch discovery users (limited to 10 users not in friends or pending lists)
        const { data: allProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, status, tagline, location')
          .neq('id', user.id)
          .limit(20);
        
        if (profilesError) throw profilesError;
        
        // Process the data to match UserProfile type
        const processedAccepted = acceptedFriendsData?.map(item => item.friend) || [];
        const processedPendingSent = pendingSentData?.map(item => item.friend) || [];
        const processedPendingReceived = pendingReceivedData?.map(item => item.user) || [];
        
        // Fix: Extract the ids properly from each array element
        const friendIds = new Set([
          ...processedAccepted.map((f: any) => f.id),
          ...processedPendingSent.map((f: any) => f.id),
          ...processedPendingReceived.map((f: any) => f.id)
        ]);
        
        const discoveryUsersList = allProfiles?.filter(profile => 
          !friendIds.has(profile.id)
        ).slice(0, 10) || [];
        
        // Set state with the processed data
        setFriends(processProfileData(processedAccepted));
        setPendingSent(processProfileData(processedPendingSent));
        setPendingReceived(processProfileData(processedPendingReceived));
        setDiscoveryUsers(processProfileData(discoveryUsersList));
        
      } catch (error) {
        console.error('Error loading friends data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load friends data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFriends();
  }, [user, supabase]);
  
  const filteredFriends = friends.filter(friend =>
    friend.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPendingSent = pendingSent.filter(friend =>
    friend.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPendingReceived = pendingReceived.filter(friend =>
    friend.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredDiscoveryUsers = discoveryUsers.filter(user =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderSkeletons = (count: number) => (
    Array(count).fill(0).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    ))
  );

  if (!user) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Friends</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
              <p className="text-gray-500 mb-4">You need to be logged in to view and manage your friends.</p>
              <Button asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </div>
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="friends">
            Friends
            {friends.length > 0 && <span className="ml-2 bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">{friends.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {pendingReceived.length > 0 && <span className="ml-2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs">{pendingReceived.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>
        
        <TabsContent value="friends">
          <Card>
            <CardHeader>
              <CardTitle>Friends</CardTitle>
              <CardDescription>These are your current friends.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {isLoading ? (
                renderSkeletons(3)
              ) : filteredFriends.length > 0 ? (
                filteredFriends.map(friend => (
                  <div key={friend.id} className="flex items-center space-x-4">
                    <Link to={`/users/${friend.id}`}>
                      <Avatar>
                        <AvatarImage src={friend.avatar_url ? friend.avatar_url[0] : ''} alt={friend.username} />
                        <AvatarFallback>{friend.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
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
        </TabsContent>
        
        <TabsContent value="requests">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Received Requests</CardTitle>
              <CardDescription>These are the friend requests you have received.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {isLoading ? (
                renderSkeletons(2)
              ) : filteredPendingReceived.length > 0 ? (
                filteredPendingReceived.map(friend => (
                  <div key={friend.id} className="flex items-center space-x-4">
                    <Link to={`/users/${friend.id}`}>
                      <Avatar>
                        <AvatarImage src={friend.avatar_url ? friend.avatar_url[0] : ''} alt={friend.username} />
                        <AvatarFallback>{friend.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
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
          
          <Card>
            <CardHeader>
              <CardTitle>Sent Requests</CardTitle>
              <CardDescription>These are the friend requests you have sent.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {isLoading ? (
                renderSkeletons(2)
              ) : filteredPendingSent.length > 0 ? (
                filteredPendingSent.map(friend => (
                  <div key={friend.id} className="flex items-center space-x-4">
                    <Link to={`/users/${friend.id}`}>
                      <Avatar>
                        <AvatarImage src={friend.avatar_url ? friend.avatar_url[0] : ''} alt={friend.username} />
                        <AvatarFallback>{friend.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
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
        </TabsContent>
        
        <TabsContent value="discover">
          <Card>
            <CardHeader>
              <CardTitle>Discover People</CardTitle>
              <CardDescription>Connect with new people.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {isLoading ? (
                renderSkeletons(5)
              ) : filteredDiscoveryUsers.length > 0 ? (
                filteredDiscoveryUsers.map(discoveryUser => (
                  <div key={discoveryUser.id} className="flex items-center space-x-4">
                    <Link to={`/users/${discoveryUser.id}`}>
                      <Avatar>
                        <AvatarImage src={discoveryUser.avatar_url ? discoveryUser.avatar_url[0] : ''} alt={discoveryUser.username} />
                        <AvatarFallback>{discoveryUser.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{discoveryUser.username}</p>
                      <p className="text-sm text-muted-foreground">{discoveryUser.location || discoveryUser.tagline || 'No information'}</p>
                    </div>
                    <div className="ml-auto">
                      <Button variant="outline" size="sm" onClick={() => handleSendFriendRequest(discoveryUser.id)}>
                        Add Friend
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No users available to add as friends.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
