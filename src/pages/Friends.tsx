
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FriendsLoginPrompt } from '@/components/friends/FriendsLoginPrompt';
import { FriendsMainContent } from '@/components/friends/FriendsMainContent';
import { useIsMobile } from '@/hooks/use-mobile';

const Friends: React.FC = () => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-teal mx-auto mb-4"></div>
          <p className="text-ocean-teal">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the login prompt with improved styling
  if (!user) {
    return (
      <div className="min-h-screen bg-pure-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-h2 font-montserrat text-graphite-grey mb-6">
              Connect with Friends
            </h1>
            <p className="text-body-base text-graphite-grey/80 font-lato mb-4">
              See what your friends are up to and discover events together
            </p>
            <div className="flex justify-center items-center gap-4 text-xl opacity-60">
              <span>👥</span>
              <span>🤝</span>
              <span>🎉</span>
            </div>
          </div>
          
          <FriendsLoginPrompt />
        </div>
      </div>
    );
  }

  // If user is authenticated, show the main friends content
  return (
    <div className="min-h-screen bg-pure-white">
      {/* Header Section */}
      <div className={`max-w-screen-lg mx-auto px-6 ${isMobile ? 'py-4' : 'py-8 sm:py-12'}`}>
        <div className="text-center">
          <h1 className={`font-bold text-graphite-grey mb-4 leading-tight font-montserrat ${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl lg:text-5xl'}`}>
            Your <span className="text-ocean-teal">crew</span>
          </h1>
          <p className={`text-graphite-grey/80 max-w-3xl mx-auto leading-relaxed mb-6 font-lato ${isMobile ? 'text-base' : 'text-lg sm:text-xl'}`}>
            See what your friends are up to and discover events together.
          </p>
        </div>
      </div>

      <FriendsMainContent />
    </div>
  );
};

export default Friends;
