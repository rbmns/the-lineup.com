import React from 'react';
import { useAdminData } from '@/hooks/useAdminData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsTable } from '@/components/admin/EventsTable';
import { VenuesTable } from '@/components/admin/VenuesTable';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeader from '@/components/polymet/page-header';

const AdminPage = () => {
  const { isAdmin, isLoading } = useAdminData();

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
            subtitle="You do not have permission to view this page."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
        <PageHeader
            title="Admin Dashboard"
            subtitle="Review and manage events and venues."
        />
      <Tabs defaultValue="events" className="mt-6">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
        </TabsList>
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
