
import React from 'react';
import { Users } from 'lucide-react';

export const SocialHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Users className="h-5 w-5 text-black" />
      <h2 className="text-lg font-medium text-black">Social</h2>
    </div>
  );
};
