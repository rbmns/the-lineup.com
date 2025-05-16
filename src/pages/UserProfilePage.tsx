import React from 'react';
import ProfileCard from '@/components/profile/ProfileCard';

const UserProfilePage: React.FC = () => {
  return (
    <div>
      {/* User Profile Page Content */}
      <ProfileCard userId="someUserId" />
    </div>
  );
};

export default UserProfilePage;
