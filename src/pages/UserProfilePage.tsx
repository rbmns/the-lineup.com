import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileHeaderContainer } from '@/components/profile/ProfileHeaderContainer';
import { ProfileEventsContainer } from '@/components/profile/ProfileEventsContainer';
import { ProfileNotFound } from '@/components/profile/ProfileNotFound';
import { ProfileLoading } from '@/components/profile/ProfileLoading';
import { AuthCheck } from '@/components/profile/AuthCheck';
import { PageHeader } from '@/components/ui/page-header';
import { UserProfile } from '@/types';
interface UserProfilePageProps {
  hideTitle?: boolean;
}
const UserProfilePage: React.FC<UserProfilePageProps> = ({
  hideTitle = false
}) => {
  const {
    username,
    userId
  } = useParams<{
    username: string;
    userId: string;
  }>();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();

  // Determine which profile to load - prioritize userId over username
  const profileIdentifier = userId || username || user?.id || null;
  const isOwnProfile = !userId && !username || userId === user?.id || username === user?.email?.split('@')[0];
  const {
    profile,
    loading,
    error,
    isNotFound,
    refreshProfile
  } = useProfileData(profileIdentifier);
  const [friendshipStatus, setFriendshipStatus] = useState<string>('none');
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  if (!user && isOwnProfile) {
    return <AuthCheck />;
  }
  if (loading) {
    return <ProfileLoading />;
  }
  if (isNotFound || error) {
    return <ProfileNotFound error={error} />;
  }
  const displayName = profile?.username || user?.email?.split('@')[0] || 'User';
  return <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Reduced padding */}
      {!hideTitle && <PageHeader title={isOwnProfile ? displayName : `${displayName}'s Profile`} subtitle={isOwnProfile ? "Manage your profile and see your event activity" : "View profile and event activity"} />}

      {/* Profile Content - Reduced padding */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Profile Header - Full width on mobile, sidebar on desktop */}
            <div className="lg:col-span-1">
              <div className="rounded-lg shadow-sm p-4 md:p-6 text-white sticky top-6">
                <ProfileHeaderContainer profile={profile} isOwnProfile={isOwnProfile} user={user} profileId={profile?.id || null} refreshProfile={refreshProfile} onUpdateFriendship={setFriendshipStatus} onUpdateBlockStatus={setIsBlocked} />
              </div>
            </div>

            {/* Events Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <ProfileEventsContainer profileId={profile?.id || null} profile={profile as UserProfile} isLoading={loading} isOwnProfile={isOwnProfile} isBlocked={isBlocked} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default UserProfilePage;