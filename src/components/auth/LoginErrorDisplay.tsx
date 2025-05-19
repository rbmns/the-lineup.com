
import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface LoginErrorDisplayProps {
  error: string | null;
  showAdvancedError: boolean;
  setShowAdvancedError: (show: boolean) => void;
  retryCount: number;
  waitTime: number;
  rateLimited: boolean;
}

export const LoginErrorDisplay: React.FC<LoginErrorDisplayProps> = ({
  error,
  showAdvancedError,
  setShowAdvancedError,
  retryCount,
  waitTime,
  rateLimited
}) => {
  if (!error) return null;
  
  return (
    <>
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <p>{error}</p>
          {(error.includes("rate limit") || error.includes("timed out") || error.includes("too many requests")) && (
            <p className="text-sm mt-1">Supabase limits authentication attempts to prevent abuse. Please try again later.</p>
          )}
          <button 
            className="text-xs underline mt-1 text-red-600"
            onClick={() => setShowAdvancedError(!showAdvancedError)}
          >
            {showAdvancedError ? "Hide technical details" : "Show technical details"}
          </button>
        </div>
      </div>
      
      {showAdvancedError && (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded flex items-start mt-2 mb-4">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold">Technical information:</p>
            <p>This issue may be related to Supabase's rate limiting. Your account may be temporarily restricted due to multiple login attempts.</p>
            <p className="mt-1">Retry count: {retryCount}</p>
            <p>Wait time: {waitTime} seconds</p>
            <p>Rate limited: {rateLimited ? "Yes" : "No"}</p>
          </div>
        </div>
      )}
    </>
  );
};
