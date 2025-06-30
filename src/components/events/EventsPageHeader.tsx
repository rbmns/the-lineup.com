
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventsPageHeaderProps {
  title: string;
  subtitle?: string;
  showBackground?: boolean;
  backgroundImage?: string;
}

export const EventsPageHeader: React.FC<EventsPageHeaderProps> = ({ 
  title, 
  subtitle, 
  showBackground = true,
  backgroundImage = "/lovable-uploads/7f287109-ef9d-4780-ae28-713458ecf85c.png"
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full bg-coconut border-b border-ocean-deep/10">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-display font-bold tracking-tight text-ocean-deep mb-2 leading-tight`}>
            {title}
          </h1>
          
          {/* Tagline */}
          <div className="mt-2">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-ocean-deep/70 font-mono font-medium uppercase tracking-wider`}>
              Discover • Connect • Experience
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
