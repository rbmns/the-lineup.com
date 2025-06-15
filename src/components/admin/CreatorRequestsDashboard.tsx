
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreatorRequestService } from '@/services/CreatorRequestService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Request {
  id: string;
  created_at: string;
  is_read: boolean;
  data: {
    user_id: string;
    username: string;
    user_email: string;
    reason: string;
    contact_email?: string;
    contact_phone?: string;
  };
}

interface CreatorRequestsDashboardProps {
  requests: Request[];
}

export const CreatorRequestsDashboard: React.FC<CreatorRequestsDashboardProps> = ({ requests }) => {
  const queryClient = useQueryClient();

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-requests'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'An error occurred.');
    },
  };

  const approveMutation = useMutation({
    mutationFn: ({ userId, notificationId }: { userId: string, notificationId: string }) => CreatorRequestService.approveCreatorRequest(userId, notificationId),
    ...mutationOptions,
    onSuccess: () => {
      toast.success('Request approved!');
      mutationOptions.onSuccess();
    }
  });

  const denyMutation = useMutation({
    mutationFn: ({ userId, notificationId }: { userId: string, notificationId: string }) => CreatorRequestService.denyCreatorRequest(userId, notificationId),
    ...mutationOptions,
    onSuccess: () => {
      toast.info('Request denied.');
      mutationOptions.onSuccess();
    }
  });

  const pendingRequests = requests.filter(r => !r.is_read);

  if (pendingRequests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>No pending creator requests.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pendingRequests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <span>Request from: {request.data.username}</span>
              <Badge variant={request.is_read ? 'secondary' : 'default'}>
                {request.is_read ? 'Handled' : 'New'}
              </Badge>
            </CardTitle>
            <CardDescription>
              {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>User Email:</strong> {request.data.user_email}</p>
            <p><strong>Reason for request:</strong></p>
            <blockquote className="pl-4 border-l-2 italic">"{request.data.reason}"</blockquote>
            {request.data.contact_email && <p><strong>Contact Email:</strong> {request.data.contact_email}</p>}
            {request.data.contact_phone && <p><strong>Contact Phone:</strong> {request.data.contact_phone}</p>}
            
            {!request.is_read && (
              <div className="flex gap-2 pt-4">
                <Button 
                  size="sm" 
                  onClick={() => approveMutation.mutate({ userId: request.data.user_id, notificationId: request.id })}
                  disabled={approveMutation.isPending || denyMutation.isPending}
                >
                  {approveMutation.isPending ? 'Approving...' : 'Approve'}
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => denyMutation.mutate({ userId: request.data.user_id, notificationId: request.id })}
                  disabled={approveMutation.isPending || denyMutation.isPending}
                >
                   {denyMutation.isPending ? 'Denying...' : 'Deny'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
