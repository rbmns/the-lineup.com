
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CreatorDashboard } from '@/components/organise/CreatorDashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

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
          Create and manage your events
        </p>
      </div>

      {/* Content */}
      <div className={cn(
        "mx-auto",
        isMobile ? "px-4" : "px-8"
      )}>
        <CreatorDashboard />
      </div>
    </div>
  );
};

export default Dashboard;
