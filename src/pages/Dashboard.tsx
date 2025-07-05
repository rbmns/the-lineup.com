
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CreatorDashboard } from '@/components/organise/CreatorDashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-coastal-haze to-pure-white">
      {/* Header Section with brand colors */}
      <div className={cn(
        "section-content text-center relative overflow-hidden",
        isMobile ? "py-6 px-4" : "py-16"
      )}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-teal/5 to-seafoam-drift/10 rounded-b-3xl"></div>
        
        <div className="relative z-10">
          <h1 className={cn(
            "text-graphite-grey mb-3 font-montserrat font-bold",
            isMobile ? "text-3xl" : "text-h1"
          )}>
            Event Dashboard
          </h1>
          <p className={cn(
            "text-horizon-blue mx-auto font-lato",
            isMobile ? "text-base max-w-sm" : "text-body-large max-w-2xl"
          )}>
            Create, manage, and track your events in one beautiful place
          </p>
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        "mx-auto relative z-10",
        isMobile ? "px-4 -mt-4" : "px-8 -mt-8"
      )}>
        <CreatorDashboard />
      </div>
    </div>
  );
};

export default Dashboard;
