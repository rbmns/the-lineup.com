
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUserEvents } from '@/hooks/useUserEvents';
import { useFriendship } from '@/hooks/useFriendship';
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileEventsSection } from '@/components/profile/ProfileEventsSection';
import { Loader2, User, Settings, Calendar, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState('info');
  
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
  
  // Redirect to login if trying to view own profile but not logged in
  useEffect(() => {
    if (isOwnProfile && !user) {
      navigate('/login');
    }
  }, [isOwnProfile, user, navigate]);

  // Handle adding friend
  const handleAddFriend = async () => {
    if (userId && sendFriendRequest) {
      await sendFriendRequest();
    }
  };

  // Determine if user can view events based on friendship status
  const canViewEvents = isOwnProfile || friendshipStatus === 'accepted';

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

  // Calculate member since date
  const memberSince = profile?.created_at 
    ? format(new Date(profile.created_at), 'MMMM yyyy')
    : 'Unknown';

  // Activity stats
  const activityStats = [
    { value: pastEvents?.length || 0, label: 'Events Attended' },
    { value: upcomingEvents?.length || 0, label: 'Interested In' },
    { value: 17, label: 'Friends' } // Placeholder, would need to fetch actual friends count
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold tracking-tight mb-6">
        {isOwnProfile ? 'My Profile' : `${profile?.username || 'User'}'s Profile`}
      </h1>
      
      {/* Profile Header Card */}
      <Card className="mb-6 overflow-hidden border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="hidden md:block">
              <ProfileAvatar profile={profile} size="xl" />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight">{profile?.username}</h2>
                  <p className="text-gray-500">@{profile?.username?.toLowerCase()}</p>
                </div>
                
                {isOwnProfile && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => navigate('/profile/edit')}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                {profile?.tagline || "No bio provided yet."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs Navigation */}
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Personal Info</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>My Events</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Personal Info Tab */}
        <TabsContent value="info">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold tracking-tight mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="text-base leading-7">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="text-base leading-7">{profile?.location || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Member Since</p>
                  <p className="text-base leading-7">{memberSince}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold tracking-tight mb-4">Preferences</h3>
              <p className="text-base leading-7">Preferences settings will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold tracking-tight mb-4">My Events</h3>
              {canViewEvents ? (
                <ProfileEventsSection 
                  canViewEvents={canViewEvents}
                  upcomingEvents={upcomingEvents}
                  pastEvents={pastEvents}
                  eventsLoading={eventsLoading}
                  isCurrentUser={isOwnProfile}
                  username={profile?.username}
                  handleAddFriend={handleAddFriend}
                  friendshipStatus={friendshipStatus as 'none' | 'pending' | 'accepted'}
                />
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-500">You need to be friends to view events.</p>
                  <Button onClick={handleAddFriend} className="mt-2">
                    Add Friend
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Activity Stats */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Activity</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {activityStats.map((stat, index) => (
              <div key={index} className="p-4">
                <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
