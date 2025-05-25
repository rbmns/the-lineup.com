
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventsPageHeaderProps {
  title: string;
  subtitle: string;
}

export const EventsPageHeader: React.FC<EventsPageHeaderProps> = ({ title, subtitle }) => {
  const isMobile = useIsMobile();

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
