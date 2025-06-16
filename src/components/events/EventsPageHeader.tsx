
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { typography } from '@/components/polymet/brand-typography';

interface EventsPageHeaderProps {
  title: string;
  subtitle: string;
  showBackground?: boolean;
  backgroundImage?: string;
}

export const EventsPageHeader: React.FC<EventsPageHeaderProps> = ({ 
  title, 
  subtitle, 
  showBackground = false,
  backgroundImage = "/lovable-uploads/7f287109-ef9d-4780-ae28-713458ecf85c.png"
}) => {
  const isMobile = useIsMobile();

  if (showBackground) {
    return (
      <div className="relative h-[200px] md:h-[250px] overflow-hidden w-full bg-secondary m-0 p-0">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Content - Left aligned */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 text-left text-white m-0 p-0">
          <h1 className={`${typography.display} mb-2 text-left text-white mt-0`}>
            {title}
          </h1>
          {!isMobile && (
            <p className={`${typography.lead} text-white/90 leading-relaxed max-w-2xl text-left mt-0 mb-0`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b bg-card m-0 p-0">
      <div className="px-4 text-left m-0 p-0">
        <h1 className={`${typography.h1} mb-2 text-left mt-0`}>
          {title}
        </h1>
        <p className={`${typography.lead} text-left mt-0`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};
