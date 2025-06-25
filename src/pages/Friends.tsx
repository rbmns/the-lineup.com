
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FriendsLoginPrompt } from '@/components/friends/FriendsLoginPrompt';
import { FriendsMainContent } from '@/components/friends/FriendsMainContent';

const Friends: React.FC = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005F73] mx-auto mb-4"></div>
          <p className="text-[#005F73]">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the login prompt with consistent styling
  if (!user) {
    return (
      <div className="w-full bg-white min-h-screen">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#F9F3E9] to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005F73] mb-6 leading-tight">
              Connect with your <span className="text-[#2A9D8F]">crew</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#4A4A48] max-w-3xl mx-auto leading-relaxed mb-8">
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
        </section>
        
        <div className="bg-white">
          <FriendsLoginPrompt />
        </div>
      </div>
    );
  }

  // If user is authenticated, show the main friends content with consistent styling
  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#F9F3E9] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005F73] mb-6 leading-tight">
            Your <span className="text-[#2A9D8F]">crew</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#4A4A48] max-w-3xl mx-auto leading-relaxed mb-8">
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
      </section>

      <div className="bg-white">
        <FriendsMainContent />
      </div>
    </div>
  );
};

export default Friends;
