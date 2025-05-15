
import React, { useEffect } from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { AvatarUploadWrapper } from '@/components/profile/AvatarUploadWrapper';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { processEventData } from '@/utils/eventProcessorUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { filterUpcomingEvents, filterPastEvents, sortEventsByDate } from '@/utils/dateUtils';
import { UserEvents } from '@/components/profile/UserEvents';
import { UserPastEvents } from '@/components/profile/UserPastEvents';

const Profile = () => {
  const { user, profile, isAuthenticated, loading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useRouterLocation();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = React.useState(true);
  
  // Only refresh profile when navigating from edit page with refreshNeeded flag
  useEffect(() => {
    const shouldRefresh = location.state?.refreshNeeded === true;
    
    if (!authLoading && user?.id && shouldRefresh) {
      console.log("Profile updated, refreshing profile data...");
      refreshProfile();
      
      // Clear the state to prevent further refreshes
      navigate('/profile', { 
        replace: true,
        state: {} 
      });
    }
  }, [location.state, user?.id, refreshProfile, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated && !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate, authLoading]);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user?.id) return;
      
      try {
        setEventsLoading(true);
        
        const { data, error } = await supabase
          .from('event_rsvps')
          .select(`
            status,
            events (
              id, title, description, event_type,
              start_time, end_time, image_urls, creator, venue_id,
              venues:venue_id (
                id, name, street, city
              ),
              created_at, updated_at
            )
          `)
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error fetching events:', error);
          setEventsLoading(false);
          return;
        }
        
        const userEvents = data
          .filter(item => item.events)
          .map(item => {
            const eventData = item.events as any;
            const processedEvent = processEventData(eventData, user.id);
            return {
              ...processedEvent,
              rsvp_status: item.status as 'Going' | 'Interested'
            };
          });
          
        setEvents(userEvents);
      } catch (err) {
        console.error('Exception fetching events:', err);
      } finally {
        setEventsLoading(false);
      }
    };
    
    if (user?.id) {
      fetchUserEvents();
    }
  }, [user?.id]);

  if (authLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container py-8">
        <Card className="p-8 text-center">
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">Please log in</h1>
            <p className="text-gray-500 mb-4">You need to be logged in to view your profile.</p>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-8">
        <Card className="p-8 text-center">
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">Loading Profile</h1>
            <p className="text-gray-500 mb-4">We're retrieving your profile information...</p>
            <Loader2 className="h-8 w-8 animate-spin text-purple mx-auto mb-4" />
            <Button onClick={() => refreshProfile()}>Reload Profile</Button>
            <Button onClick={() => navigate('/')} className="ml-2" variant="outline">Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const upcomingEvents = sortEventsByDate(filterUpcomingEvents(events));
  const pastEvents = filterPastEvents(events);

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  return (
    <div className="container max-w-4xl py-6 px-4 md:px-8">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      
      <div className="mb-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6 flex flex-col items-center">
            <AvatarUploadWrapper size="xl" className="mb-4" />
            <ProfileHeader 
              profile={{
                id: profile?.id || '',
                username: profile?.username || '',
                avatar_url: Array.isArray(profile?.avatar_url) && profile?.avatar_url && profile?.avatar_url.length > 0 
                  ? profile.avatar_url[0] 
                  : '',
                tagline: profile?.tagline || '',
                location: profile?.location || '',
                status: profile?.status || null,
              }}
              viewingOwnProfile={true}
              showAvatar={false}
              onEditProfile={handleEditProfile}
            />
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="pt-1">
            {eventsLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-purple mr-2" />
                <span className="text-sm">Loading your upcoming events...</span>
              </div>
            ) : (
              <UserEvents 
                events={upcomingEvents}
                loading={false}
                isCurrentUser={true}
                showRsvpStatus={true}
              />
            )}
          </TabsContent>
          
          <TabsContent value="past" className="pt-1">
            {eventsLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-purple mr-2" />
                <span className="text-sm">Loading your past events...</span>
              </div>
            ) : (
              <UserPastEvents 
                events={pastEvents}
                loading={false}
                isCurrentUser={true}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
