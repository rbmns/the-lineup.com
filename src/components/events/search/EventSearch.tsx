
import React from 'react';

interface EventSearchProps {
  placeholder?: string;
  className?: string;
}

export const EventSearch: React.FC<EventSearchProps> = ({ 
  placeholder = "Search events...", 
  className 
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full p-2 pl-8 border border-gray-200 rounded-lg"
      />
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      </div>
    </div>
  );
};
