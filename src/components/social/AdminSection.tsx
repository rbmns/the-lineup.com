
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface AdminSectionProps {
  pendingRequestsCount: number;
  onShowRequestsManager: () => void;
}

export const AdminSection: React.FC<AdminSectionProps> = ({
  pendingRequestsCount,
  onShowRequestsManager
}) => {
  return (
    <div className="py-2 border-b">
      <h3 className="text-xs font-semibold uppercase text-muted-foreground px-1 mb-2">Admin</h3>
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={onShowRequestsManager}
      >
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Creator Requests
        </span>
        {pendingRequestsCount > 0 && (
          <Badge variant="destructive" className="h-5">{pendingRequestsCount}</Badge>
        )}
      </Button>
    </div>
  );
};
