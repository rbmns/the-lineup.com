
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventsPageLayoutProps {
  children: React.ReactNode;
}

export const EventsPageLayout: React.FC<EventsPageLayoutProps> = ({
  children
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full">
      {/* Content - No background styling or containers */}
      <div className={`${isMobile ? 'px-3 py-4' : 'px-4 sm:px-6 py-4 sm:py-6'}`}>
        {children}
      </div>
    </div>
  );
};
