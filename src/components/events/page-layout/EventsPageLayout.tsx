
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
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Content - No padding top, flows directly from nav with proper mobile spacing */}
      <div className={cn(
        "w-full max-w-full overflow-x-hidden",
        isMobile ? 'px-4 py-4' : 'px-4 sm:px-6 py-6'
      )}>
        {children}
      </div>
    </div>
  );
};
