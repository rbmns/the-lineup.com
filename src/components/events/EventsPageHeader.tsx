
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
    <div className="mb-8">
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="text-xl text-muted-foreground leading-relaxed mt-2">{subtitle}</p>}
    </div>
  );
};
