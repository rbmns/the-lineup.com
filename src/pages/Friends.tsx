
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FriendsLoginPrompt } from '@/components/friends/FriendsLoginPrompt';
import { FriendsMainContent } from '@/components/friends/FriendsMainContent';

const Friends: React.FC = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary-25 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the login prompt with consistent styling
  if (!user) {
    return (
      <div className="w-full bg-gradient-to-b from-secondary-25 to-white min-h-screen">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-white to-secondary-25">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Connect with your <span className="text-vibrant-seafoam">crew</span>
            </h1>
            <p className="text-xl text-neutral max-w-3xl mx-auto leading-relaxed mb-8">
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
    <div className="w-full bg-gradient-to-b from-secondary-25 to-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-secondary-25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Your <span className="text-vibrant-seafoam">crew</span>
          </h1>
          <p className="text-xl text-neutral max-w-3xl mx-auto leading-relaxed mb-8">
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
