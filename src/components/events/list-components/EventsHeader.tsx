
import React from 'react';

interface EventsHeaderProps {
  title?: string;
  subtitle?: string;
}

export const EventsHeader: React.FC<EventsHeaderProps> = ({
  title = "Events",
  subtitle
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && (
        <p className="text-gray-600 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default EventsHeader;
