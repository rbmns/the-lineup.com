
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatorRequestService } from '@/services/CreatorRequestService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Users } from 'lucide-react';
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

const fetchCreatorRequests = async (): Promise<CreatorRequestNotification[]> => {
  const { data, error } = await CreatorRequestService.getCreatorRequestsForAdmin();
  if (error) {
    if (error.code === '42501') { // RLS error
      throw new Error("You don't have permission to view this data. Make sure you are logged in as an admin.");
    }
    throw new Error('Could not fetch creator requests.');
  }
  return data || [];
};

const CreatorRequestActions: React.FC<{ request: CreatorRequestNotification, disabled: boolean }> = ({ request, disabled }) => {
    const queryClient = useQueryClient();

    const mutationOptions = {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['adminCreatorRequests'] });
      },
      onError: (err: Error) => {
        toast.error(`Action failed: ${err.message}`);
      }
    };

    const approveMutation = useMutation({
        mutationFn: ({ userId, notificationId }: { userId: string, notificationId: string }) => CreatorRequestService.approveCreatorRequest(userId, notificationId),
        ...mutationOptions,
        onSuccess: () => {
            toast.success("Request approved!");
            mutationOptions.onSuccess();
        }
    });

    const denyMutation = useMutation({
        mutationFn: ({ userId, notificationId }: { userId: string, notificationId: string }) => CreatorRequestService.denyCreatorRequest(userId, notificationId),
        ...mutationOptions,
        onSuccess: () => {
            toast.warning("Request denied.");
            mutationOptions.onSuccess();
        }
    });

    const handleApprove = () => {
        approveMutation.mutate({ userId: request.data.user_id, notificationId: request.id });
    };

    const handleDeny = () => {
        denyMutation.mutate({ userId: request.data.user_id, notificationId: request.id });
    };
    
    const isProcessing = approveMutation.isPending || denyMutation.isPending;

    return (
        <div className="flex gap-2">
            <Button size="sm" onClick={handleApprove} disabled={disabled || isProcessing}>Approve</Button>
            <Button size="sm" variant="outline" onClick={handleDeny} disabled={disabled || isProcessing}>Deny</Button>
        </div>
    );
}

const CreatorRequestsTable: React.FC<{ requests: CreatorRequestNotification[], caption: string }> = ({ requests, caption }) => (
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
);


interface CreatorRequestsManagerProps {
    open: boolean;
    onClose: () => void;
}

export const CreatorRequestsManager: React.FC<CreatorRequestsManagerProps> = ({ open, onClose }) => {
  const { data: requests, isLoading, isError, error } = useQuery<CreatorRequestNotification[], Error>({
    queryKey: ['adminCreatorRequests'],
    queryFn: fetchCreatorRequests
  });

  const BodyContent = () => {
    if (isLoading) {
        return (
          <div className="space-y-4 p-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        );
    }
    
    if (isError) {
        return (
          <Alert variant="destructive" className="m-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Loading Requests</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        );
    }

    const pendingRequests = requests?.filter(r => !r.is_read) || [];
    const handledRequests = requests?.filter(r => r.is_read) || [];
  
    return (
        <div className="space-y-8 py-4">
            <Card>
                <CardHeader>
                    <CardTitle>Pending Requests ({pendingRequests.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <CreatorRequestsTable requests={pendingRequests} caption="No new creator requests." />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Handled Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <CreatorRequestsTable requests={handledRequests} caption="No handled requests yet." />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Creator Requests
          </DialogTitle>
          <DialogDescription>
            Review and manage requests from users to become event creators.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
            <BodyContent />
        </div>
      </DialogContent>
    </Dialog>
  );
};
