
import React from 'react';

interface EventsPageHeaderProps {
  title: string;
  subtitle?: string;
}

export const EventsPageHeader: React.FC<EventsPageHeaderProps> = ({ 
  title,
  subtitle
}) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
      {subtitle && <p className="text-xl text-muted-foreground leading-relaxed">{subtitle}</p>}
    </div>
  );
};
