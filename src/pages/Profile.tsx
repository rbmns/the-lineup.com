
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { FakeProfileContent } from '@/components/fake-content/FakeProfileContent';
import { ProfileMainContent } from '@/components/profile/ProfileMainContent';

const Profile: React.FC = () => {
  const { user } = useAuth();
  
  // If no user, show fake content with overlay
  if (!user) {
    return (
      <AuthOverlay 
        title="Create Your Profile" 
        description="Sign in to view and customize your personal profile and activity."
      >
        <FakeProfileContent />
      </AuthOverlay>
    );
  }

  return <ProfileMainContent />;
};

export default Profile;
