
import React from 'react';
import { useAdminData } from '@/hooks/useAdminData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsTable } from '@/components/admin/EventsTable';
import { VenuesTable } from '@/components/admin/VenuesTable';
import { CreatorRequestsDashboard } from '@/components/admin/CreatorRequestsDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeader from '@/components/polymet/page-header';
import { Badge } from '@/components/ui/badge';

const AdminPage = () => {
  const { isAdmin, requests, isLoading } = useAdminData();

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-10 text-center">
        <PageHeader
            title="Access Denied"
            description="You do not have permission to view this page."
        />
      </div>
    );
  }

  const pendingRequestsCount = requests?.filter(r => !r.is_read).length || 0;

  return (
    <div className="container mx-auto py-10">
        <PageHeader
            title="Admin Dashboard"
            description="Review and manage events, venues, and creator requests."
        />
      <Tabs defaultValue="creator-requests" className="mt-6">
        <TabsList>
          <TabsTrigger value="creator-requests" className="flex items-center gap-2">
            Creator Requests
            {pendingRequestsCount > 0 && (
              <Badge variant="destructive" className="h-5 min-w-5 text-xs">
                {pendingRequestsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
        </TabsList>
        <TabsContent value="creator-requests" className="mt-4">
          <CreatorRequestsDashboard requests={requests || []} />
        </TabsContent>
        <TabsContent value="events" className="mt-4">
          <EventsTable />
        </TabsContent>
        <TabsContent value="venues" className="mt-4">
          <VenuesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
