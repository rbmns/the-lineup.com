
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { FakeFriendsContent } from '@/components/fake-content/FakeFriendsContent';
import { FriendsMainContent } from '@/components/friends/FriendsMainContent';

const Friends: React.FC = () => {
  const { user } = useAuth();

  // If user is not authenticated, show the overlay with fake content
  if (!user) {
    return (
      <AuthOverlay 
        title="Connect with Friends" 
        description="Sign in to connect with travelers and locals in your area."
      >
        <FakeFriendsContent />
      </AuthOverlay>
    );
  }

  return <FriendsMainContent />;
};

export default Friends;
