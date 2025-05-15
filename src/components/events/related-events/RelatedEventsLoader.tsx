
import React from 'react';
import { Loader2 } from 'lucide-react';

interface RelatedEventsLoaderProps {
  title?: string;
}

export const RelatedEventsLoader: React.FC<RelatedEventsLoaderProps> = ({ 
  title = "Similar Events" 
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 font-inter tracking-tight">{title}</h2>
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="ml-2 text-gray-500 font-inter leading-7">Loading related events...</p>
      </div>
    </div>
  );
};

export default RelatedEventsLoader;
