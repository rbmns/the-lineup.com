
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProfilePageLayout } from '@/components/profile/ProfilePageLayout';
import { useProfileData } from '@/hooks/useProfileData';
import { SettingsPanel } from '@/components/profile/SettingsPanel';
import { useAdminData } from '@/hooks/useAdminData';
import { CreatorRequestsDashboard } from '@/components/admin/CreatorRequestsDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  // Show settings for regular users, add admin tab if user is admin
  const showAdminTab = isAdmin;
  const numTabs = showAdminTab ? 2 : 1;
  const gridColsClass = `grid-cols-${numTabs}`;

  const defaultTab = 'settings';

  return (
    <>
      <ProfilePageLayout
        profile={profile}
        isOwnProfile={true}
        showSettings={false}
        onToggleSettings={() => {}}
      />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-5xl">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className={`grid w-full ${gridColsClass}`}>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">
              Settings
            </TabsTrigger>
            {showAdminTab && (
              <TabsTrigger value="admin" className="text-xs sm:text-sm">
                Creator Requests
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="settings" className="mt-4 sm:mt-6">
            <SettingsPanel userId={user.id} />
          </TabsContent>
          
          {showAdminTab && (
            <TabsContent value="admin" className="mt-4 sm:mt-6">
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
