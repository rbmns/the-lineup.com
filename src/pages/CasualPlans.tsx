
import React from 'react';
import { useCasualPlans } from '@/hooks/useCasualPlans';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CasualPlanCard } from '@/components/casual-plans/CasualPlanCard';

const CasualPlans = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { plans, isLoading, rsvpToPlan, loadingPlanId } = useCasualPlans();

  console.log('CasualPlans component - plans:', plans);
  console.log('CasualPlans component - isLoading:', isLoading);
  console.log('CasualPlans component - user:', user);
  console.log('CasualPlans component - isAuthenticated:', isAuthenticated);

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
        
        {isAuthenticated && (
          <Button onClick={() => navigate('/casual-plans/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        )}
      </div>

      {/* Login prompt for non-authenticated users */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Join the community to see full details
          </h3>
          <p className="text-blue-700 mb-4">
            Sign up to view locations, times, and connect with other members creating casual plans.
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/signup')}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}

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
                  onRsvp={isAuthenticated ? handleRsvp : undefined}
                  showRsvpButtons={isAuthenticated}
                  isLoading={loadingPlanId === plan.id}
                  showBlurred={!isAuthenticated}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No casual plans yet
              </h3>
              <p className="text-gray-600 mb-4">
                {isAuthenticated 
                  ? "Be the first to create a spontaneous meetup!"
                  : "Sign in to see if there are any casual plans in your area."
                }
              </p>
              {isAuthenticated && (
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
