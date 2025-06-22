
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const HomeWelcomeSection: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-primary mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email}!
          </h2>
          <p className="text-lg text-neutral">
            Ready to discover your next adventure?
          </p>
        </div>
      </div>
    </section>
  );
};
