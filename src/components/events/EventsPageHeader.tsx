import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
      <div className="relative h-[200px] md:h-[250px] overflow-hidden w-full">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content - Left aligned */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-6 lg:px-8 text-left text-white">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-left">
            {title}
          </h1>
          {!isMobile && (
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl text-left">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b bg-white">
      <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8 text-left">
        <h1 className={`font-bold tracking-tight mb-2 text-left ${isMobile ? 'text-xl' : 'text-3xl md:text-4xl'}`}>
          {title}
        </h1>
        <p className={`text-muted-foreground leading-relaxed text-left ${isMobile ? 'text-sm' : 'text-lg md:text-xl'}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};
