
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005F73] mx-auto mb-4"></div>
          <p className="text-[#005F73]">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the login prompt with optimized mobile layout
  if (!user) {
    return (
      <div className="min-h-screen">
        {/* Header Section - Optimized for mobile above the fold */}
        <div className={`max-w-screen-lg mx-auto px-6 ${isMobile ? 'py-8' : 'py-16 sm:py-20 lg:py-24'}`}>
          <div className="text-center">
            <h1 className={`font-bold text-[#005F73] mb-6 leading-tight ${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl lg:text-5xl'}`}>
              Connect with your <span className="text-[#2A9D8F]">crew</span>
            </h1>
            <p className={`text-[#4A4A48] max-w-3xl mx-auto leading-relaxed mb-8 ${isMobile ? 'text-base' : 'text-lg sm:text-xl'}`}>
              See what your friends are up to, discover events together, and make new connections.
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
        
        <FriendsLoginPrompt />
      </div>
    );
  }

  // If user is authenticated, show the main friends content with optimized mobile layout
  return (
    <div className="min-h-screen">
      {/* Header Section - Optimized for mobile */}
      <div className={`max-w-screen-lg mx-auto px-6 ${isMobile ? 'py-8' : 'py-16 sm:py-20 lg:py-24'}`}>
        <div className="text-center">
          <h1 className={`font-bold text-[#005F73] mb-6 leading-tight ${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl lg:text-5xl'}`}>
            Your <span className="text-[#2A9D8F]">crew</span>
          </h1>
          <p className={`text-[#4A4A48] max-w-3xl mx-auto leading-relaxed mb-8 ${isMobile ? 'text-base' : 'text-lg sm:text-xl'}`}>
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
