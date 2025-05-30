
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ProfileHeaderContainer } from '@/components/profile/ProfileHeaderContainer';
import { ProfileEventsContainer } from '@/components/profile/ProfileEventsContainer';
import { useProfileData } from '@/hooks/useProfileData';

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading, refreshProfile } = useProfileData(user?.id);

  if (loading || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleUpdateFriendship = (status: string) => {
    console.log('Friendship status updated:', status);
    refreshProfile();
  };

  const handleUpdateBlockStatus = (blocked: boolean) => {
    console.log('Block status updated:', blocked);
    refreshProfile();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <ProfileHeaderContainer
        profile={profile}
        isOwnProfile={true}
        user={user}
        profileId={user.id}
        refreshProfile={refreshProfile}
        onUpdateFriendship={handleUpdateFriendship}
        onUpdateBlockStatus={handleUpdateBlockStatus}
      />
      <ProfileEventsContainer
        profileId={user.id}
        profile={profile}
        isLoading={profileLoading}
        isOwnProfile={true}
        isBlocked={false}
      />
    </div>
  );
};

export default ProfilePage;
