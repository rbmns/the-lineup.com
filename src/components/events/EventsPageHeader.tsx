
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
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        {/* Background Image */}
        <img
          src={backgroundImage}
          alt="Events Header"
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className={`font-bold tracking-tight mb-4 ${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'}`}>
            {title}
          </h1>
          <p className={`text-white/90 leading-relaxed max-w-2xl ${isMobile ? 'text-base' : 'text-lg md:text-xl'}`}>
            {subtitle}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-4 py-6 md:py-8 text-center">
        <h1 className={`font-bold tracking-tight mb-2 ${isMobile ? 'text-xl' : 'text-3xl md:text-4xl'}`}>
          {title}
        </h1>
        <p className={`text-muted-foreground leading-relaxed ${isMobile ? 'text-sm' : 'text-lg md:text-xl'}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};
