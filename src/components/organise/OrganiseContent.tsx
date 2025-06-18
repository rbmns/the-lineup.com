import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';
import { RequestCreatorForm } from './RequestCreatorForm';
import { CreatorDashboard } from './CreatorDashboard';

export const OrganiseContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { canCreateEvents, creatorRequestStatus, isLoading } = useCreatorStatus();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-4">Access Your Dashboard</h2>
            <p className="text-gray-600 mb-6">
              Sign in to access your event management dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If user can create events, show the dashboard
  if (canCreateEvents) {
    return <CreatorDashboard />;
  }

  // Otherwise show the request form
  return <RequestCreatorForm />;
};
