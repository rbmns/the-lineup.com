
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProfilePageLayout } from '@/components/profile/ProfilePageLayout';
import { useProfileData } from '@/hooks/useProfileData';
import { UserRsvpedEvents } from '@/components/profile/UserRsvpedEvents';
import { useAdminData } from '@/hooks/useAdminData';
import { CreatorRequestsDashboard } from '@/components/admin/CreatorRequestsDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserEvents } from '@/hooks/useUserEvents';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    profile,
    loading: profileLoading,
    error,
    isNotFound
  } = useProfileData(user?.id);
  
  const { isAdmin, requests, isLoading: isAdminLoading } = useAdminData();
  const { upcomingEvents, pastEvents, isLoading: eventsLoading } = useUserEvents(user?.id);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect in the effect
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isNotFound || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  // Show only RSVPs tab for regular users, add admin tab if user is admin
  const showAdminTab = isAdmin;
  const numTabs = showAdminTab ? 2 : 1;
  const gridColsClass = `grid-cols-${numTabs}`;

  const defaultTab = 'rsvps';

  return (
    <>
      <ProfilePageLayout
        profile={profile}
        isOwnProfile={true}
        showSettings={false}
        onToggleSettings={() => {}}
      />
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-5xl">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className={`grid w-full ${gridColsClass}`}>
            <TabsTrigger value="rsvps" className="text-xs sm:text-sm">
              My RSVPs
            </TabsTrigger>
            {showAdminTab && (
              <TabsTrigger value="admin" className="text-xs sm:text-sm">
                Creator Requests
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="rsvps" className="mt-6 sm:mt-8">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming" className="text-xs sm:text-sm px-2 sm:px-4">
                  Upcoming ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="text-xs sm:text-sm px-2 sm:px-4">
                  Past ({pastEvents.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-4 sm:mt-6">
                <UserRsvpedEvents 
                  userId={user.id} 
                  events={upcomingEvents}
                  isLoading={eventsLoading}
                  emptyMessage="No upcoming RSVPs"
                  title="Your Upcoming RSVPs"
                />
              </TabsContent>
              
              <TabsContent value="past" className="mt-4 sm:mt-6">
                <UserRsvpedEvents 
                  userId={user.id} 
                  events={pastEvents}
                  isLoading={eventsLoading}
                  emptyMessage="No past RSVPs"
                  title="Your Past RSVPs"
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          {showAdminTab && (
            <TabsContent value="admin" className="mt-6 sm:mt-8">
              {isAdminLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>
              ) : (
                <CreatorRequestsDashboard requests={requests || []} />
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default ProfilePage;
