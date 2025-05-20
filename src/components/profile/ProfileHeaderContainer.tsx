
import React from 'react';
import { UserProfile } from '@/types';
import { ProfileHeader } from './ProfileHeader';
import { FriendManagement } from './FriendManagement';
import { ProfileAccessControl } from './ProfileAccessControl';

interface ProfileHeaderContainerProps {
  profile: UserProfile | null;
  isOwnProfile: boolean;
  user: any;
  profileId: string | null;
  refreshProfile: () => void;
  onUpdateFriendship: (status: string) => void;
  onUpdateBlockStatus: (blocked: boolean) => void;
}

export const ProfileHeaderContainer: React.FC<ProfileHeaderContainerProps> = ({
  profile,
  isOwnProfile,
  user,
  profileId,
  refreshProfile,
  onUpdateFriendship,
  onUpdateBlockStatus
}) => {
  return (
    <div className="space-y-4">
      <ProfileHeader profile={profile} />
      
      {!isOwnProfile && user && profileId && (
        <FriendManagement
          profile={profile}
          currentUserId={user.id}
          onUpdateFriendship={onUpdateFriendship}
          onBlock={onUpdateBlockStatus}
          refreshProfile={refreshProfile}
        />
      )}
      
      {isOwnProfile && user && (
        <ProfileAccessControl
          profile={profile}
          onUpdate={refreshProfile}
        />
      )}
    </div>
  );
};
