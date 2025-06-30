
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
    <div className="relative w-full bg-pure-white border-b border-mist-grey">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${isMobile ? 'text-h2' : 'text-h1'} font-display font-bold tracking-tight text-graphite-grey mb-2 leading-tight`}>
            {title}
          </h1>
          
          {/* Tagline */}
          <div className="mt-2">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-graphite-grey/70 font-montserrat font-semibold uppercase tracking-wider`}>
              Discover • Connect • Experience
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
