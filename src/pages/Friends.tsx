
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
      <div className="min-h-screen flex items-center justify-center bg-pure-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-teal mx-auto mb-4"></div>
          <p className="text-body-base text-graphite-grey font-lato">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the login prompt with design system styling
  if (!user) {
    return (
      <div className="min-h-screen bg-pure-white flex flex-col justify-center">
        {/* Header Section - Using global typography */}
        <div className="section-content">
          <div className="text-center">
            <h1 className="text-h1 font-montserrat text-graphite-grey mb-4 leading-tight">
              Connect with your <span className="text-ocean-teal">crew</span>
            </h1>
            <p className="text-body-base font-lato text-graphite-grey max-w-2xl mx-auto leading-relaxed mb-6">
              See what your friends are up to, discover events together, and make new connections.
            </p>
            <div className="flex justify-center items-center gap-4 text-2xl opacity-60 mb-8">
              <span>👥</span>
              <span>🤝</span>
              <span>🎉</span>
              <span>💫</span>
              <span>🌟</span>
            </div>
          </div>
        </div>
        
        <FriendsLoginPrompt />
      </div>
    );
  }

  // If user is authenticated, show the main friends content
  return (
    <div className="min-h-screen bg-pure-white">
      {/* Header Section - Using global design system */}
      <div className="section-content">
        <div className="text-center">
          <h1 className="text-h1 font-montserrat text-graphite-grey mb-4 leading-tight">
            Your <span className="text-ocean-teal">crew</span>
          </h1>
          <p className="text-body-base font-lato text-graphite-grey max-w-3xl mx-auto leading-relaxed mb-6">
            See what your friends are up to and discover events together.
          </p>
          <div className="flex justify-center items-center gap-6 text-2xl opacity-60 mb-8">
            <span>👥</span>
            <span>🤝</span>
            <span>🎉</span>
            <span>💫</span>
            <span>🌟</span>
          </div>
        </div>
      </div>

      <FriendsMainContent />
    </div>
  );
};

export default Friends;
