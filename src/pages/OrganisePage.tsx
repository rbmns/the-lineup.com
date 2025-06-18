
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { OrganiseContent } from '@/components/organise/OrganiseContent';

const OrganisePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <AuthOverlay
        title="Join to Organize Events"
        description="Sign up or log in to create casual plans and organize events!"
        browseEventsButton={true}
        onClose={() => {}}
        onBrowseEvents={() => {}}
      >
        <div className="min-h-screen bg-gray-50" />
      </AuthOverlay>
    );
  }

  return <OrganiseContent />;
};

export default OrganisePage;
