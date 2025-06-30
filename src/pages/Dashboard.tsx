
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';
import { CreatorDashboard } from '@/components/organise/CreatorDashboard';
import { OrganiseContent } from '@/components/organise/OrganiseContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { canCreateEvents, isLoading } = useCreatorStatus();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pure-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-pure-white">
      {/* Header Section */}
      <div className={cn(
        "section-content text-center",
        isMobile ? "py-4 px-4" : "py-12"
      )}>
        <h1 className={cn(
          "text-graphite-grey mb-2",
          isMobile ? "text-2xl font-bold" : "text-h1"
        )}>
          Dashboard
        </h1>
        <p className={cn(
          "text-graphite-grey mx-auto",
          isMobile ? "text-sm max-w-xs" : "text-body-base max-w-2xl"
        )}>
          {isAuthenticated && canCreateEvents 
            ? "Manage your events and track their performance"
            : "Get started with organizing events"
          }
        </p>
      </div>

      {/* Content */}
      <div className={cn(
        "mx-auto",
        isMobile ? "px-4" : "px-8"
      )}>
        {isAuthenticated && canCreateEvents ? (
          <CreatorDashboard />
        ) : (
          <OrganiseContent />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
