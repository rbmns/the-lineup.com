
import React from 'react';
import { useCasualPlans } from '@/hooks/useCasualPlans';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CasualPlanCard } from '@/components/casual-plans/CasualPlanCard';

const CasualPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plans, isLoading, rsvpToPlan, loadingPlanId } = useCasualPlans();

  console.log('CasualPlans component - plans:', plans);
  console.log('CasualPlans component - isLoading:', isLoading);
  console.log('CasualPlans component - user:', user);

  const handleRsvp = async (planId: string, status: 'Going' | 'Interested') => {
    const success = await rsvpToPlan(planId, status);
    return success;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Casual Plans</h1>
          <p className="text-muted-foreground mt-2">
            Spontaneous meetups and activities with fellow travelers
          </p>
        </div>
        
        {user && (
          <Button onClick={() => navigate('/casual-plans/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {plans && plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <CasualPlanCard
                  key={plan.id}
                  plan={plan}
                  onRsvp={user ? handleRsvp : undefined}
                  showRsvpButtons={!!user}
                  isLoading={loadingPlanId === plan.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No casual plans yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to create a spontaneous meetup!
              </p>
              {user && (
                <Button onClick={() => navigate('/casual-plans/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Plan
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CasualPlans;
