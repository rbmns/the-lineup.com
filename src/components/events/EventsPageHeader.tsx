
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
      {/* Content using design system classes */}
      <div className="section-content-narrow text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${isMobile ? 'text-h2' : 'text-h1'} text-graphite-grey mb-2`}>
            {title}
          </h1>
          
          {/* Tagline using design system typography */}
          <div className="mt-2">
            <span className={`${isMobile ? 'text-xs' : 'text-small'} text-graphite-grey/70 font-montserrat font-semibold uppercase tracking-wider`}>
              Discover • Connect • Experience
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
