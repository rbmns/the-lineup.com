
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreatorRequestService } from '@/services/CreatorRequestService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, Clock, Mail, Phone } from 'lucide-react';

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
      toast.success('Creator request approved! User has been granted event creator access.');
      mutationOptions.onSuccess();
    }
  });

  const denyMutation = useMutation({
    mutationFn: ({ userId, notificationId }: { userId: string, notificationId: string }) => CreatorRequestService.denyCreatorRequest(userId, notificationId),
    ...mutationOptions,
    onSuccess: () => {
      toast.info('Creator request denied.');
      mutationOptions.onSuccess();
    }
  });

  const pendingRequests = requests.filter(r => !r.is_read);
  const handledRequests = requests.filter(r => r.is_read);

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Creator Requests</h3>
          <p>There are no creator requests to review at this time.</p>
        </CardContent>
      </Card>
    );
  }

  const RequestCard = ({ request, isPending }: { request: Request, isPending: boolean }) => (
    <Card key={request.id} className={isPending ? "border-orange-200 bg-orange-50/50" : ""}>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            <span className="text-lg">{request.data.username}</span>
            <p className="text-sm text-muted-foreground font-normal flex items-center gap-1 mt-1">
              <Mail className="h-3 w-3" />
              {request.data.user_email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isPending ? 'destructive' : 'secondary'}>
              {isPending ? 'Pending' : 'Handled'}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Submitted {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Reason for Request:</h4>
          <blockquote className="pl-4 border-l-2 border-muted italic text-muted-foreground">
            "{request.data.reason}"
          </blockquote>
        </div>
        
        {(request.data.contact_email || request.data.contact_phone) && (
          <div>
            <h4 className="font-medium mb-2">Additional Contact Information:</h4>
            <div className="space-y-1 text-sm">
              {request.data.contact_email && (
                <p className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  {request.data.contact_email}
                </p>
              )}
              {request.data.contact_phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  {request.data.contact_phone}
                </p>
              )}
            </div>
          </div>
        )}
        
        {isPending && (
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              size="sm" 
              onClick={() => approveMutation.mutate({ userId: request.data.user_id, notificationId: request.id })}
              disabled={approveMutation.isPending || denyMutation.isPending}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              {approveMutation.isPending ? 'Approving...' : 'Approve'}
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => denyMutation.mutate({ userId: request.data.user_id, notificationId: request.id })}
              disabled={approveMutation.isPending || denyMutation.isPending}
              className="flex items-center gap-1"
            >
              <XCircle className="h-3 w-3" />
              {denyMutation.isPending ? 'Denying...' : 'Deny'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {pendingRequests.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Pending Requests</h2>
            <Badge variant="destructive">{pendingRequests.length}</Badge>
          </div>
          <div className="grid gap-4">
            {pendingRequests.map((request) => (
              <RequestCard key={request.id} request={request} isPending={true} />
            ))}
          </div>
        </div>
      )}

      {handledRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recently Handled</h2>
          <div className="grid gap-4">
            {handledRequests.slice(0, 5).map((request) => (
              <RequestCard key={request.id} request={request} isPending={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
