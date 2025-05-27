import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, User, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const CasualPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimisticUpdates, setOptimisticUpdates] = useState({});

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('casual_plans')
        .select(`
          *,
          rsvps:casual_plan_rsvps (
            status,
            user_id
          )
        `);

      if (error) throw error;

      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to load casual plans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    try {
      const { data, error } = await supabase
        .from('casual_plans')
        .select(`
          *,
          rsvps:casual_plan_rsvps (
            status,
            user_id
          )
        `);

      if (error) throw error;

      setPlans(data || []);
    } catch (error) {
      console.error('Error refetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to refresh casual plans. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRsvpUpdate = useCallback(async (planId: string, newStatus: 'going' | 'interested' | 'not_going') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to RSVP to plans.",
        variant: "destructive",
      });
      return;
    }

    try {
      setOptimisticUpdates(prev => ({ ...prev, [planId]: newStatus }));

      const { error } = await supabase
        .from('casual_plan_rsvps')
        .upsert({
          plan_id: planId,
          user_id: user.id,
          status: newStatus,
          is_going: newStatus === 'going',
          is_interested: newStatus === 'interested'
        }, {
          onConflict: 'plan_id,user_id'
        });

      if (error) throw error;
      
      await refetch();
      
      toast({
        title: "RSVP updated",
        description: `You're now marked as ${newStatus.replace('_', ' ')} for this plan.`,
      });
    } catch (error) {
      console.error('Error updating RSVP:', error);
      setOptimisticUpdates(prev => {
        const updated = { ...prev };
        delete updated[planId];
        return updated;
      });
      
      toast({
        title: "Error",
        description: "Failed to update RSVP. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, supabase, refetch]);

  const getRsvpStatus = (plan: any) => {
    const rsvp = plan.rsvps?.find((rsvp: any) => rsvp.user_id === user?.id);
    return rsvp ? rsvp.status : 'not_going';
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-6">Casual Plans</h1>
      {loading ? (
        <p>Loading plans...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{format(new Date(plan.date), 'MMMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{plan.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{plan.organizer_name}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  {getRsvpStatus(plan) === 'going' ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Going
                    </div>
                  ) : getRsvpStatus(plan) === 'interested' ? (
                    <div className="flex items-center text-yellow-500">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Interested
                    </div>
                  ) : null}
                </div>
                <div className="space-x-2">
                  <Button
                    variant={optimisticUpdates[plan.id] === 'going' || getRsvpStatus(plan) === 'going' ? 'secondary' : 'outline'}
                    onClick={() => handleRsvpUpdate(plan.id, 'going')}
                    disabled={optimisticUpdates[plan.id] && optimisticUpdates[plan.id] !== 'going'}
                  >
                    {optimisticUpdates[plan.id] === 'going' ? 'Updating...' : 'Going'}
                  </Button>
                  <Button
                    variant={optimisticUpdates[plan.id] === 'interested' || getRsvpStatus(plan) === 'interested' ? 'secondary' : 'outline'}
                    onClick={() => handleRsvpUpdate(plan.id, 'interested')}
                    disabled={optimisticUpdates[plan.id] && optimisticUpdates[plan.id] !== 'interested'}
                  >
                    {optimisticUpdates[plan.id] === 'interested' ? 'Updating...' : 'Interested'}
                  </Button>
                  <Button
                    variant={getRsvpStatus(plan) === 'not_going' ? 'default' : 'outline'}
                    onClick={() => handleRsvpUpdate(plan.id, 'not_going')}
                  >
                    Not Going
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {user && (
        <div className="mt-6">
          <Button asChild>
            <Link to="/casual-plans/create">Create a New Plan</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CasualPlans;
