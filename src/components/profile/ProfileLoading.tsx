
import React from 'react';
import { Loader2 } from 'lucide-react';

export const ProfileLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-4" />
        <p className="text-gray-600">Loading profile...</p>
      </div>
    </div>
  );
};
