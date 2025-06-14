
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProfilePageLayout } from '@/components/profile/ProfilePageLayout';
import { useProfileData } from '@/hooks/useProfileData';
import { UserCreatedEvents } from '@/components/profile/UserCreatedEvents';
import { UserRsvpedEvents } from '@/components/profile/UserRsvpedEvents';
import { UserCreatedVenues } from '@/components/venues/UserCreatedVenues';
import { useAdminData } from '@/hooks/useAdminData';
import { CreatorRequestsDashboard } from '@/components/admin/CreatorRequestsDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  const {
    profile,
    loading: profileLoading,
    error,
    isNotFound
  } = useProfileData(user?.id);
  
  const { isAdmin, requests, isLoading: isAdminLoading } = useAdminData();
  const { canCreateEvents, isLoading: isCreatorStatusLoading } = useCreatorStatus();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect in the effect
  }

  const loading = profileLoading || isCreatorStatusLoading;

  if (loading) {
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
  
  let numTabs: number;
  if (canCreateEvents) {
    // For creators: "My Events", "My Venues", and "Admin" tab if they are an admin.
    numTabs = 2 + (isAdmin ? 1 : 0);
  } else {
    // For regular users: just "My RSVPs".
    numTabs = 1;
  }
  const gridColsClass = `grid-cols-${numTabs}`;

  const searchParams = new URLSearchParams(location.search);
  const tabQueryParam = searchParams.get('tab');

  const validTabs: string[] = [];
  let defaultTab: string;

  if (canCreateEvents) {
    validTabs.push('created', 'venues');
    if (isAdmin) {
      validTabs.push('admin');
    }
    defaultTab = 'created';
  } else {
    validTabs.push('rsvps');
    defaultTab = 'rsvps';
  }

  if (tabQueryParam && validTabs.includes(tabQueryParam)) {
    defaultTab = tabQueryParam;
  }


  return (
    <>
      {!canCreateEvents && (
        <ProfilePageLayout
          profile={profile}
          isOwnProfile={true}
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
        />
      )}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {canCreateEvents && (
          <div className="mb-8 pt-8">
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mt-2">Manage your events, venues, and admin tasks.</p>
          </div>
        )}
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className={`grid w-full ${gridColsClass}`}>
              {!canCreateEvents && (
                <TabsTrigger value="rsvps">
                    My RSVPs
                </TabsTrigger>
              )}
              {canCreateEvents && (
                  <>
                      <TabsTrigger value="created">
                          My Events
                      </TabsTrigger>
                      <TabsTrigger value="venues">
                          My Venues
                      </TabsTrigger>
                  </>
              )}
              {isAdmin && (
                <TabsTrigger value="admin">
                  Creator Requests
                </TabsTrigger>
              )}
          </TabsList>
          {!canCreateEvents && (
            <TabsContent value="rsvps" className="mt-8">
                <UserRsvpedEvents userId={user.id} />
            </TabsContent>
          )}
          {canCreateEvents && (
              <>
                  <TabsContent value="created" className="mt-8">
                      <UserCreatedEvents />
                  </TabsContent>
                  <TabsContent value="venues" className="mt-8">
                      <UserCreatedVenues />
                  </TabsContent>
              </>
          )}
          {isAdmin && (
            <TabsContent value="admin" className="mt-8">
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
