
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCasualPlans } from '@/hooks/useCasualPlans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CasualPlanCard } from '@/components/casual-plans/CasualPlanCard';
import { Calendar, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export const UserCasualPlans: React.FC = () => {
  const { user } = useAuth();
  const { plans, isLoading, joinPlan, leavePlan } = useCasualPlans();

  // Filter plans created by the current user
  const userCreatedPlans = plans.filter(plan => plan.creator_id === user?.id);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Casual Plans</CardTitle>
          <CardDescription>Plans you've created and are managing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Casual Plans</CardTitle>
        <CardDescription>
          Plans you've created and are managing ({userCreatedPlans.length})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userCreatedPlans.length > 0 ? (
          <div className="grid gap-4">
            {userCreatedPlans.map((plan) => (
              <div key={plan.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{plan.title}</h3>
                    {plan.description && (
                      <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(plan.date), 'MMM d, yyyy')} at {plan.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {plan.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {plan.attendee_count || 0} attending
                    {plan.max_attendees && ` / ${plan.max_attendees} max`}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {plan.vibe}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No casual plans yet
            </h3>
            <p className="text-gray-600 mb-4">
              You haven't created any casual plans yet. Start by creating your first plan!
            </p>
            <Button asChild>
              <Link to="/casual-plans/create">Create Your First Plan</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
