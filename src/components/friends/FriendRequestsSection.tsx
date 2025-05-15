
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { FriendRequests } from './FriendRequests';

interface FriendRequestsSectionProps {
  requests?: { id: string; profile: any }[];
  onAccept?: (requestId: string) => Promise<boolean>;
  onDecline?: (requestId: string) => Promise<boolean>;
  loading?: boolean;
}

export const FriendRequestsSection = ({
  requests = [],
  onAccept,
  onDecline,
  loading = false
}: FriendRequestsSectionProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
      <FriendRequests 
        requests={requests}
        loading={loading}
        handleAcceptRequest={onAccept}
        handleDeclineRequest={onDecline}
      />
      <Separator className="my-6" />
    </div>
  );
};
