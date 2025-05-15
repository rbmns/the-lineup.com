
import React from 'react';
import { Loader2 } from 'lucide-react';

export const ProfileLoading = () => {
  return (
    <div className="container py-8 flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-purple" />
        <p className="text-gray-600">Loading profile...</p>
      </div>
    </div>
  );
};
