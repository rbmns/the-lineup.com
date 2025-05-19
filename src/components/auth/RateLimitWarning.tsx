
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface RateLimitWarningProps {
  rateLimited: boolean;
  waitTime: number;
}

export const RateLimitWarning: React.FC<RateLimitWarningProps> = ({ rateLimited, waitTime }) => {
  if (!rateLimited) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded flex items-start">
      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
      <div>
        <p>Please wait {waitTime} seconds before trying again.</p>
        <p className="text-xs mt-1">Supabase limits how frequently you can attempt authentication to prevent abuse.</p>
      </div>
    </div>
  );
};
