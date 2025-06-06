
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const CommunitySection: React.FC = () => {
  return (
    <Card className="border-sand">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4 text-seafoam-green" />
          Community
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-3">
          <p className="text-sm text-gray-500">Coming soon...</p>
          <p className="text-xs text-gray-400 mt-1">Connect with locals</p>
        </div>
      </CardContent>
    </Card>
  );
};
