
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the login prompt with optimized mobile layout
  if (!user) {
    return (
      <div className="h-screen flex flex-col justify-center">
        {/* Header Section - Compact for viewport fit */}
        <div className={`max-w-screen-lg mx-auto px-6 ${isMobile ? 'py-2' : 'py-4'}`}>
          <div className="text-center">
            <h1 className={`font-bold text-primary mb-2 leading-tight ${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>
              Connect with your <span className="text-secondary">crew</span>
            </h1>
            <p className={`auth-subtext max-w-2xl mx-auto leading-relaxed mb-3 ${isMobile ? 'text-sm' : 'text-base'}`}>
              See what your friends are up to, discover events together, and make new connections.
            </p>
            <div className="flex justify-center items-center gap-4 text-xl opacity-60">
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

  // If user is authenticated, show the main friends content with optimized mobile layout
  return (
    <div className="min-h-screen">
      {/* Header Section - Optimized for mobile */}
      <div className={`max-w-screen-lg mx-auto px-6 ${isMobile ? 'py-4' : 'py-8 sm:py-12'}`}>
        <div className="text-center">
          <h1 className={`font-bold text-primary mb-4 leading-tight ${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl lg:text-5xl'}`}>
            Your <span className="text-secondary">crew</span>
          </h1>
          <p className={`auth-subtext max-w-3xl mx-auto leading-relaxed mb-6 ${isMobile ? 'text-base' : 'text-lg sm:text-xl'}`}>
            See what your friends are up to and discover events together.
          </p>
          <div className="flex justify-center items-center gap-6 text-2xl opacity-60">
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
