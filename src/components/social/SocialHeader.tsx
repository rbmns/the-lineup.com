
import React from 'react';
import { Users } from 'lucide-react';

export const SocialHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Users className="h-5 w-5 text-seafoam-green" />
      <h2 className="text-lg font-medium text-ocean-deep">Social</h2>
    </div>
  );
};
