import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
interface EventsPageLayoutProps {
  children: React.ReactNode;
}
export const EventsPageLayout: React.FC<EventsPageLayoutProps> = ({
  children
}) => {
  const isMobile = useIsMobile();
  return <div className="min-h-screen w-full bg-gradient-to-b from-secondary-25 to-white">
      {/* Hero Section - Much larger like casual plans page */}
      

      {/* Content */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </div>
      </div>
    </div>;
};