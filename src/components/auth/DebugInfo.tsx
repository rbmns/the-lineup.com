
import React from 'react';

interface DebugInfoProps {
  debugInfo: string | null;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ debugInfo }) => {
  if (!debugInfo) return null;
  
  return (
    <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded flex items-start mb-4">
      <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
    </div>
  );
};
