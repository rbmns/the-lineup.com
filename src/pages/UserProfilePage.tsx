
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUserEvents } from '@/hooks/useUserEvents';
import { useFriendship } from '@/hooks/useFriendship';
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileEventsSection } from '@/components/profile/ProfileEventsSection';
import { PrivacySettings } from '@/components/profile/PrivacySettings';
import { 
  Loader2, 
  User, 
  Settings, 
  Calendar, 
  Pencil, 
  Shield, 
  Users, 
  Mail, 
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { ProfileCard } from '@/components/profile/ProfileCard';

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
    { value: upcomingEvents?.length || 0, label: 'Upcoming Events' },
    { value: 17, label: 'Friends' } // Placeholder, would need to fetch actual friends count
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Hero section with background and profile overview */}
      <div className="relative mb-8 rounded-lg overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-end gap-6 text-white">
          <ProfileAvatar profile={profile} size="xl" className="w-24 h-24 md:w-32 md:h-32 border-4 border-white/80 shadow-xl" />
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight">
              {isOwnProfile ? 'My Profile' : `${profile?.username || 'User'}'s Profile`}
            </h1>
            <p className="text-xl text-white/80 mt-2">
              {profile?.tagline || (isOwnProfile ? "Add a tagline to tell others about yourself" : "No tagline provided")}
            </p>
            <div className="flex items-center mt-3 text-white/80">
              {profile?.location && (
                <div className="flex items-center mr-6">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Member since {memberSince}</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex mt-4 md:mt-0 gap-3">
            {isOwnProfile ? (
              <Button 
                onClick={() => navigate('/profile/edit')}
                className="flex items-center gap-2"
                variant="secondary"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <ProfileCard 
                profile={profile} 
                friendStatus={friendshipStatus as 'none' | 'pending' | 'accepted'}
                onAddFriend={handleAddFriend}
                isCompact={true}
                linkToProfile={false}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Activity Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {activityStats.map((stat, index) => (
          <Card key={index} className="text-center border-0 shadow-md">
            <CardContent className="p-6">
              <p className="text-4xl font-bold tracking-tight text-purple-600">{stat.value}</p>
              <p className="text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Personal Info</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>My Events</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Personal Info Tab */}
        <TabsContent value="info">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your personal details and profile information</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {profile?.username && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Username</h3>
                    <p className="text-base leading-7">{profile.username}</p>
                  </div>
                )}
                
                {profile?.email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <p className="text-base leading-7">{profile.email}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-base leading-7">{profile?.location || "Not specified"}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-base leading-7">{memberSince}</p>
                  </div>
                </div>
                
                {profile?.tagline && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">About</h3>
                    <p className="text-base leading-7">{profile.tagline}</p>
                  </div>
                )}
              </div>
              
              {isOwnProfile && (
                <div className="mt-8 pt-6 border-t">
                  <Button 
                    onClick={() => navigate('/profile/edit')} 
                    className="flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Privacy Tab */}
        <TabsContent value="privacy">
          {isOwnProfile ? (
            <PrivacySettings userId={user?.id} />
          ) : (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Privacy settings are only visible to the account owner.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Events Tab */}
        <TabsContent value="events">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>
                {isOwnProfile ? 'Your upcoming and past events' : `${profile?.username || 'User'}'s events`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
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
                <div className="text-center p-8">
                  <Shield className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium mb-2">Private Events</h3>
                  <p className="text-gray-500 mb-4">You need to be friends to view events.</p>
                  <Button onClick={handleAddFriend}>
                    <Users className="h-4 w-4 mr-2" />
                    Add Friend
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
