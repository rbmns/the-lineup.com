
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Star, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { RequestCreatorModal } from '@/components/social/RequestCreatorModal';
import { CreatorRequestService } from '@/services/CreatorRequestService';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { UserCasualPlans } from './UserCasualPlans';

interface CreatorRequestFormValues {
  reason: string;
  contact_email?: string;
  contact_phone?: string;
}

export const OrganiseContent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { canCreateEvents, creatorRequestStatus, isLoading } = useCreatorStatus();
  const [showRequestCreator, setShowRequestCreator] = useState(false);

  const handleRequestCreator = async (formData: CreatorRequestFormValues) => {
    if (!user) return;
    
    const { error } = await CreatorRequestService.requestCreatorAccess(user.id, formData);
    if (error) {
      toast.error("There was an issue submitting your request. Please try again.");
    } else {
      toast.success("Your request has been submitted!");
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, email')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        const { error: notificationError } = await CreatorRequestService.notifyAdminOfCreatorRequest(
          user.id, 
          formData, 
          {
            username: profile.username || 'N/A',
            email: profile.email || user.email || 'N/A',
          }
        );

        if (notificationError) {
          console.error("Failed to create admin notification", notificationError);
        }
      }
    }
    setShowRequestCreator(false);
  };

  const getCreatorStatusMessage = () => {
    if (canCreateEvents) {
      return { text: "You can create events", color: "text-green-600" };
    }
    
    switch (creatorRequestStatus) {
      case 'pending':
        return { text: "Request pending approval", color: "text-yellow-600" };
      case 'approved':
        return { text: "Request approved", color: "text-green-600" };
      case 'rejected':
        return { text: "Request was declined", color: "text-red-600" };
      default:
        return { text: "Not requested", color: "text-gray-600" };
    }
  };

  const statusMessage = getCreatorStatusMessage();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Organise</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Create casual plans, manage your events, and organize memorable experiences.
        </p>
      </div>

      <Tabs defaultValue="casual-plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="casual-plans" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Casual Plans
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="casual-plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Casual Plans
              </CardTitle>
              <CardDescription>
                Create spontaneous meetups and activities with fellow travelers and locals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full sm:w-auto">
                <Link to="/casual-plans/create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Casual Plan
                </Link>
              </Button>
            </CardContent>
          </Card>

          <UserCasualPlans />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Creation
              </CardTitle>
              <CardDescription>
                Organize official events and manage your event portfolio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Creator Status</p>
                  <p className={`text-sm ${statusMessage.color}`}>
                    {statusMessage.text}
                  </p>
                </div>
                {!canCreateEvents && creatorRequestStatus !== 'pending' && (
                  <Button 
                    onClick={() => setShowRequestCreator(true)}
                    variant="outline"
                    size="sm"
                  >
                    Request Access
                  </Button>
                )}
              </div>

              {canCreateEvents ? (
                <Button 
                  onClick={() => navigate('/events/create')}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Event
                </Button>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Event Creator Access Required
                  </h3>
                  <p className="text-gray-600 mb-4">
                    To create official events, you need to request creator access from our team.
                  </p>
                  {creatorRequestStatus === 'not_requested' && (
                    <Button onClick={() => setShowRequestCreator(true)}>
                      Request Creator Access
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RequestCreatorModal
        open={showRequestCreator}
        onClose={() => setShowRequestCreator(false)}
        onRequest={handleRequestCreator}
        requestStatus={creatorRequestStatus}
      />
    </div>
  );
};
