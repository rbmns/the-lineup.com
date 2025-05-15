
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
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
import { toast } from "@/hooks/use-toast"
import { useUserEvents } from '@/hooks/useUserEvents';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import EventCard from '@/components/EventCard';
import { filterUpcomingEvents, sortEventsByDate } from '@/utils/dateUtils';
import { useCanonical } from '@/hooks/useCanonical';
import { pageSeoTags } from '@/utils/seoUtils';

interface Person {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string | null;
}

const Friends = () => {
  useCanonical('/friends', pageSeoTags.friends.title);

  const { user, isAuthenticated } = useAuth();
  const [friends, setFriends] = useState<Person[]>([]);
  const [friendRequests, setFriendRequests] = useState<Person[]>([]);
  const [sentRequests, setSentRequests] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'pending' | 'requested' | 'accepted'>('none');

  const {
    userEvents,
    isLoading: isUserEventsLoading,
    upcomingEvents,
    pastEvents,
    handleRsvp,
    refetch
  } = useUserEvents(selectedFriendId, user?.id, friendshipStatus);

  useEffect(() => {
    document.title = pageSeoTags.friends.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', pageSeoTags.friends.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute('content', pageSeoTags.friends.title);
    if (ogDesc) ogDesc.setAttribute('content', pageSeoTags.friends.description);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    const fetchFriends = async () => {
      setIsLoading(true);
      try {
        // Fetch accepted friends
        const { data: acceptedFriends, error: acceptedError } = await supabase
          .from('friends')
          .select('person1_id, person2_id, profiles(id, username, avatar_url, status)')
          .or(`person1_id.eq.${user.id},person2_id.eq.${user.id}`)
          .eq('status', 'accepted');

        if (acceptedError) {
          console.error('Error fetching accepted friends:', acceptedError);
          toast({
            title: "Error",
            description: "Failed to load friends.",
            variant: "destructive",
          })
          return;
        }

        const friendList: Person[] = [];
        acceptedFriends.forEach(friendship => {
          const friendProfile = (friendship.person1_id === user.id) ? friendship.profiles : (friendship.profiles as any);
          if (friendProfile) {
            friendList.push({
              id: friendProfile.id,
              username: friendProfile.username,
              avatar_url: friendProfile.avatar_url,
              status: friendProfile.status
            });
          }
        });
        setFriends(friendList);

        // Fetch friend requests
        const { data: friendRequestsData, error: friendRequestsError } = await supabase
          .from('friends')
          .select('person1_id, profiles(id, username, avatar_url, status)')
          .eq('person2_id', user.id)
          .eq('status', 'pending');

        if (friendRequestsError) {
          console.error('Error fetching friend requests:', friendRequestsError);
          toast({
            title: "Error",
            description: "Failed to load friend requests.",
            variant: "destructive",
          })
          return;
        }

        const friendRequestsList: Person[] = friendRequestsData.map(request => ({
          id: request.profiles.id,
          username: request.profiles.username,
          avatar_url: request.profiles.avatar_url,
          status: request.profiles.status
        }));
        setFriendRequests(friendRequestsList);

        // Fetch sent requests
        const { data: sentRequestsData, error: sentRequestsError } = await supabase
          .from('friends')
          .select('person2_id, profiles(id, username, avatar_url, status)')
          .eq('person1_id', user.id)
          .eq('status', 'pending');

        if (sentRequestsError) {
          console.error('Error fetching sent requests:', sentRequestsError);
          toast({
            title: "Error",
            description: "Failed to load sent friend requests.",
            variant: "destructive",
          })
          return;
        }

        const sentRequestsList: Person[] = sentRequestsData.map(request => ({
          id: request.profiles.id,
          username: request.profiles.username,
          avatar_url: request.profiles.avatar_url,
          status: request.profiles.status
        }));
        setSentRequests(sentRequestsList);

      } catch (error) {
        console.error('Unexpected error fetching friends:', error);
        toast({
          title: "Error",
          description: "Failed to load friends.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [user, isAuthenticated]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', `%${searchQuery}%`)
        .not('id', 'eq', user?.id);

      if (error) {
        console.error('Error searching users:', error);
        toast({
          title: "Error",
          description: "Failed to search users.",
          variant: "destructive",
        })
        return;
      }

      setSearchResults(data as Person[]);
    } catch (error) {
      console.error('Unexpected error searching users:', error);
      toast({
        title: "Error",
        description: "Failed to search users.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .insert([{ person1_id: user?.id, person2_id: friendId, status: 'pending' }]);

      if (error) {
        console.error('Error sending friend request:', error);
        toast({
          title: "Error",
          description: "Failed to send friend request.",
          variant: "destructive",
        })
        return;
      }

      setSearchResults(prevResults => prevResults.filter(person => person.id !== friendId));
      setSentRequests(prevRequests => [...prevRequests, { id: friendId, username: '', avatar_url: null, status: null }]);
      toast({
        title: "Success",
        description: "Friend request sent!",
        variant: "default",
      })
    } catch (error) {
      console.error('Unexpected error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request.",
        variant: "destructive",
      })
    }
  };

  const handleAcceptRequest = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('person1_id', friendId)
        .eq('person2_id', user?.id);

      if (error) {
        console.error('Error accepting friend request:', error);
        toast({
          title: "Error",
          description: "Failed to accept friend request.",
          variant: "destructive",
        })
        return;
      }

      setFriendRequests(prevRequests => prevRequests.filter(person => person.id !== friendId));
      setFriends(prevFriends => [...prevFriends, { id: friendId, username: '', avatar_url: null, status: null }]);
      toast({
        title: "Success",
        description: "Friend request accepted!",
        variant: "default",
      })
    } catch (error) {
      console.error('Unexpected error accepting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to accept friend request.",
        variant: "destructive",
      })
    }
  };

  const handleRejectRequest = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('person1_id', friendId)
        .eq('person2_id', user?.id);

      if (error) {
        console.error('Error rejecting friend request:', error);
        toast({
          title: "Error",
          description: "Failed to reject friend request.",
          variant: "destructive",
        })
        return;
      }

      setFriendRequests(prevRequests => prevRequests.filter(person => person.id !== friendId));
      toast({
        title: "Success",
        description: "Friend request rejected!",
        variant: "default",
      })
    } catch (error) {
      console.error('Unexpected error rejecting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to reject friend request.",
        variant: "destructive",
      })
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .or(`and(person1_id.eq.${user?.id},person2_id.eq.${friendId}),and(person1_id.eq.${friendId},person2_id.eq.${user?.id})`);

      if (error) {
        console.error('Error removing friend:', error);
        toast({
          title: "Error",
          description: "Failed to remove friend.",
          variant: "destructive",
        })
        return;
      }

      setFriends(prevFriends => prevFriends.filter(person => person.id !== friendId));
      toast({
        title: "Success",
        description: "Friend removed!",
        variant: "default",
      })
    } catch (error) {
      console.error('Unexpected error removing friend:', error);
      toast({
        title: "Error",
        description: "Failed to remove friend.",
        variant: "destructive",
      })
    }
  };

  const selectFriend = async (friend: Person) => {
    setSelectedFriendId(friend.id);
    setFriendshipStatus('accepted');
  };

  const selectFriendRequest = async (friend: Person) => {
    setSelectedFriendId(friend.id);
    setFriendshipStatus('requested');
  };

  const selectSentRequest = async (friend: Person) => {
    setSelectedFriendId(friend.id);
    setFriendshipStatus('pending');
  };

  const clearSelectedFriend = () => {
    setSelectedFriendId(null);
    setFriendshipStatus('none');
  };

  // Get the user events for the currently selected friend
  const {
    userEvents,
    isLoading: isUserEventsLoading,
    upcomingEvents,
    pastEvents,
    handleRsvp,
    refetch
  } = useUserEvents(selectedFriendId, user?.id, friendshipStatus);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel: Friends List */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Friends</CardTitle>
                <CardDescription>Manage your friends and connections.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {friends.length > 0 ? (
                  <ul className="space-y-2">
                    {friends.map((friend) => (
                      <li key={friend.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3" onClick={() => selectFriend(friend)}>
                          <Avatar>
                            <AvatarImage src={friend.avatar_url || ""} />
                            <AvatarFallback>{friend.username?.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">{friend.username}</p>
                            <p className="text-sm text-muted-foreground">Status: {friend.status || 'N/A'}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="icon" onClick={() => handleRemoveFriend(friend.id)}>
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No friends yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Friend Requests</CardTitle>
                <CardDescription>Approve or reject incoming friend requests.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {friendRequests.length > 0 ? (
                  <ul className="space-y-2">
                    {friendRequests.map(request => (
                      <li key={request.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3" onClick={() => selectFriendRequest(request)}>
                          <Avatar>
                            <AvatarImage src={request.avatar_url || ""} />
                            <AvatarFallback>{request.username?.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">{request.username}</p>
                            <p className="text-sm text-muted-foreground">Status: {request.status || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleAcceptRequest(request.id)}>
                            Accept
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleRejectRequest(request.id)}>
                            Reject
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No friend requests.</p>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Sent Requests</CardTitle>
                <CardDescription>Manage your sent friend requests.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sentRequests.length > 0 ? (
                  <ul className="space-y-2">
                    {sentRequests.map(request => (
                      <li key={request.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3" onClick={() => selectSentRequest(request)}>
                          <Avatar>
                            <AvatarImage src={request.avatar_url || ""} />
                            <AvatarFallback>{request.username?.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">{request.username}</p>
                            <p className="text-sm text-muted-foreground">Status: {request.status || 'N/A'}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No sent requests.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Middle Panel: Search Users */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Search Users</CardTitle>
                <CardDescription>Find new friends by searching for their username.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="search">Username</Label>
                  <Input
                    id="search"
                    placeholder="Enter username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>

                {searchResults.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Search Results</h3>
                    <ul className="space-y-2">
                      {searchResults.map(person => (
                        <li key={person.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={person.avatar_url || ""} />
                              <AvatarFallback>{person.username?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium leading-none">{person.username}</p>
                              <p className="text-sm text-muted-foreground">Status: {person.status || 'N/A'}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="icon" onClick={() => handleAddFriend(person.id)}>
                            Add Friend
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Selected Friend's Events */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedFriendId ? "Friend's Events" : "Select a Friend"}
                </CardTitle>
                <CardDescription>
                  View upcoming and past events of your selected friend.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedFriendId ? (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="upcoming">
                      <AccordionTrigger>Upcoming Events</AccordionTrigger>
                      <AccordionContent>
                        {isUserEventsLoading ? (
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                          </div>
                        ) : upcomingEvents.length > 0 ? (
                          <div className="grid grid-cols-1 gap-4">
                            {upcomingEvents.map((event) => (
                              <EventCard
                                key={event.id}
                                event={event}
                                onRsvp={handleRsvp}
                                showRsvpButtons={false}
                                compact={true}
                              />
                            ))}
                          </div>
                        ) : (
                          <p>No upcoming events.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="past">
                      <AccordionTrigger>Past Events</AccordionTrigger>
                      <AccordionContent>
                        {isUserEventsLoading ? (
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                          </div>
                        ) : pastEvents.length > 0 ? (
                          <div className="grid grid-cols-1 gap-4">
                            {pastEvents.map((event) => (
                              <EventCard
                                key={event.id}
                                event={event}
                                onRsvp={handleRsvp}
                                showRsvpButtons={false}
                                compact={true}
                              />
                            ))}
                          </div>
                        ) : (
                          <p>No past events.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <p>Select a friend to view their events.</p>
                )}
              </CardContent>
              {selectedFriendId && (
                <CardFooter>
                  <Button variant="secondary" onClick={clearSelectedFriend}>Clear Selection</Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
