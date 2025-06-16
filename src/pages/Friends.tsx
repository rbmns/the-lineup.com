
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FriendsLoginPrompt } from '@/components/friends/FriendsLoginPrompt';
import { FriendsMainContent } from '@/components/friends/FriendsMainContent';

const Friends: React.FC = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A9D8F] mx-auto mb-4"></div>
          <p className="text-[#005F73]">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the login prompt
  if (!user) {
    return <FriendsLoginPrompt />;
  }

  // If user is authenticated, show the main friends content
  return <FriendsMainContent />;
};

export default Friends;
