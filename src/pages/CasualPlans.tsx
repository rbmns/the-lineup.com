
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
    <div className="min-h-screen bg-[#F4E7D3]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#003840]">Casual Plans</h1>
            <p className="text-[#4A4A48] mt-2 text-sm sm:text-base">
              Spontaneous meetups and activities with fellow travelers
            </p>
          </div>
          
          {isAuthenticated && (
            <Button 
              onClick={() => navigate('/casual-plans/create')}
              className="bg-[#66B2B2] hover:bg-[#66B2B2]/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          )}
        </div>

        {/* Login prompt for non-authenticated users */}
        {!isAuthenticated && (
          <div className="bg-white border border-[#66B2B2]/20 rounded-xl p-6 mb-8 shadow-sm">
            <h3 className="text-lg font-semibold text-[#003840] mb-2">
              Join the community to see full details
            </h3>
            <p className="text-[#4A4A48] mb-4">
              Sign up to view locations, times, and connect with other members creating casual plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => navigate('/login')}
                className="bg-[#66B2B2] hover:bg-[#66B2B2]/90 text-white"
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/signup')}
                className="border-[#66B2B2] text-[#003840] hover:bg-[#66B2B2]/10"
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-xl border border-gray-200 h-64 shadow-sm"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {plans && plans.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                <div className="text-4xl sm:text-6xl mb-4">🏖️</div>
                <h3 className="text-lg sm:text-xl font-medium text-[#003840] mb-2">
                  No casual plans yet
                </h3>
                <p className="text-[#4A4A48] mb-4 text-sm sm:text-base">
                  {isAuthenticated 
                    ? "Be the first to create a spontaneous meetup!"
                    : "Sign in to see if there are any casual plans in your area."
                  }
                </p>
                {isAuthenticated && (
                  <Button 
                    onClick={() => navigate('/casual-plans/create')}
                    className="bg-[#66B2B2] hover:bg-[#66B2B2]/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Plan
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CasualPlans;
