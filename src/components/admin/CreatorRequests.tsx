
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatorRequestService } from '@/services/CreatorRequestService';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CreatorRequestNotification {
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

const fetchCreatorRequests = async () => {
  const { data, error } = await CreatorRequestService.getCreatorRequestsForAdmin();
  if (error) {
    if (error.code === '42501') { // RLS error
      throw new Error("You don't have permission to view this data. Make sure you are logged in as an admin.");
    }
    throw new Error('Could not fetch creator requests.');
  }
  return data as CreatorRequestNotification[];
};

const CreatorRequestActions: React.FC<{ request: CreatorRequestNotification, disabled: boolean }> = ({ request, disabled }) => {
    const queryClient = useQueryClient();

    const approveMutation = useMutation({
        mutationFn: ({ userId, notificationId }: { userId: string, notificationId: string }) => CreatorRequestService.approveCreatorRequest(userId, notificationId),
        onSuccess: () => {
        toast.success("Request approved!");
        queryClient.invalidateQueries({ queryKey: ['creatorRequests'] });
        },
        onError: (err) => {
        toast.error(`Failed to approve request: ${err.message}`);
        }
    });

    const denyMutation = useMutation({
        mutationFn: ({ userId, notificationId }: { userId: string, notificationId: string }) => CreatorRequestService.denyCreatorRequest(userId, notificationId),
        onSuccess: () => {
        toast.warning("Request denied.");
        queryClient.invalidateQueries({ queryKey: ['creatorRequests'] });
        },
        onError: (err) => {
        toast.error(`Failed to deny request: ${err.message}`);
        }
    });

    const handleApprove = () => {
        approveMutation.mutate({ userId: request.data.user_id, notificationId: request.id });
    };

    const handleDeny = () => {
        denyMutation.mutate({ userId: request.data.user_id, notificationId: request.id });
    };

    return (
        <div className="flex gap-2">
            <Button size="sm" onClick={handleApprove} disabled={disabled || approveMutation.isPending || denyMutation.isPending}>Approve</Button>
            <Button size="sm" variant="outline" onClick={handleDeny} disabled={disabled || approveMutation.isPending || denyMutation.isPending}>Deny</Button>
        </div>
    );
}

const CreatorRequestsTable: React.FC<{ requests: CreatorRequestNotification[], title: string, caption: string }> = ({ requests, title, caption }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <Table>
                    <TableCaption>{requests.length === 0 ? caption : null}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Received</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>
                                    <div className="font-medium">{request.data.username}</div>
                                    <div className="text-sm text-muted-foreground">{request.data.user_email}</div>
                                </TableCell>
                                <TableCell className="max-w-xs truncate" title={request.data.reason}>{request.data.reason}</TableCell>
                                <TableCell>
                                    {request.data.contact_email && <div>{request.data.contact_email}</div>}
                                    {request.data.contact_phone && <div>{request.data.contact_phone}</div>}
                                </TableCell>
                                <TableCell>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</TableCell>
                                <TableCell>
                                    {request.is_read 
                                    ? <Badge variant="secondary">Handled</Badge> 
                                    : <CreatorRequestActions request={request} disabled={request.is_read} />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
);

const CreatorRequests = () => {
  const { data: requests, isLoading, isError, error } = useQuery<CreatorRequestNotification[]>({
    queryKey: ['creatorRequests'],
    queryFn: fetchCreatorRequests
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Loading Requests</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  const pendingRequests = requests?.filter(r => !r.is_read) || [];
  const handledRequests = requests?.filter(r => r.is_read) || [];
  
  return (
    <div className="space-y-8">
      <CreatorRequestsTable requests={pendingRequests} title={`Pending Requests (${pendingRequests.length})`} caption="No new creator requests."/>
      <CreatorRequestsTable requests={handledRequests} title="Handled Requests" caption="No handled requests yet."/>
    </div>
  );
};

export default CreatorRequests;
