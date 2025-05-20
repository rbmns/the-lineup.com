
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-purple" />
      <span className="ml-2 text-gray-500">Loading events...</span>
    </div>
  );
};
