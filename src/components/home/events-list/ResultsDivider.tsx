
import React from 'react';
import { Separator } from '@/components/ui/separator';

export const ResultsDivider: React.FC = () => {
  return (
    <div className="mt-12 mb-8">
      <Separator className="my-4" />
      <div className="text-center text-gray-600 text-sm">
        End of your search results. Showing similar happenings below.
      </div>
    </div>
  );
};
