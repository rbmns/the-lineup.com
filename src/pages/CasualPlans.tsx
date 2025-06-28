import React from 'react';
import { useCasualPlans } from '@/hooks/useCasualPlans';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CasualPlanCard } from '@/components/casual-plans/CasualPlanCard';
import { useIsMobile } from '@/hooks/use-mobile';

const CasualPlans = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { plans, isLoading, rsvpToPlan, loadingPlanId } = useCasualPlans();
  const isMobile = useIsMobile();

  console.log('CasualPlans component - plans:', plans);
  console.log('CasualPlans component - isLoading:', isLoading);
  console.log('CasualPlans component - user:', user);
  console.log('CasualPlans component - isAuthenticated:', isAuthenticated);

  const handleRsvp = async (planId: string, status: 'Going' | 'Interested') => {
    const success = await rsvpToPlan(planId, status);
    return success;
  };

  // For non-authenticated users, make the page fit in viewport
  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col justify-center">
        {/* Header Section - Compact for viewport fit */}
        <div className={`max-w-screen-lg mx-auto px-6 ${isMobile ? 'py-2' : 'py-4'}`}>
          <div className="text-center">
            <h1 className={`font-bold text-[#005F73] mb-2 leading-tight ${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>
              Casual <span className="text-[#2A9D8F]">Plans</span>
            </h1>
            <p className={`text-[#4A4A48] max-w-2xl mx-auto leading-relaxed ${isMobile ? 'text-sm mb-3' : 'text-base mb-4'}`}>
              Spontaneous meetups and activities with fellow travelers
            </p>
          </div>
        </div>

        <div className={`max-w-screen-lg mx-auto px-6 ${isMobile ? 'py-2' : 'py-4'}`}>
          {/* Login prompt for non-authenticated users - Compact for viewport fit */}
          <div className={`border border-[#2A9D8F]/20 rounded-xl ${isMobile ? 'p-4 mx-2' : 'p-6'}`}>
            <h3 className={`font-semibold text-[#005F73] mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
              Join the community to see full details
            </h3>
            <p className={`text-[#4A4A48] mb-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Sign up to view locations, times, and connect with other members creating casual plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={() => navigate('/login')}
                className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white"
                size={isMobile ? "default" : "lg"}
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/signup')}
                className="border-[#2A9D8F] text-[#005F73] hover:bg-[#2A9D8F]/10"
                size={isMobile ? "default" : "lg"}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For authenticated users, keep the existing layout
  return (
    <div className="min-h-screen">
      {/* Header Section - Optimized for mobile above the fold */}
      <div className={`max-w-screen-lg mx-auto px-6 ${isMobile ? 'py-8' : 'py-12 sm:py-16'}`}>
        <div className="text-center">
          <h1 className={`font-bold text-[#005F73] mb-4 leading-tight ${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl lg:text-5xl'}`}>
            Casual <span className="text-[#2A9D8F]">Plans</span>
          </h1>
          <p className={`text-[#4A4A48] max-w-3xl mx-auto leading-relaxed ${isMobile ? 'text-base mb-6' : 'text-lg sm:text-xl mb-6'}`}>
            Spontaneous meetups and activities with fellow travelers
          </p>
          
          <Button 
            onClick={() => navigate('/casual-plans/create')}
            className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </div>

      <div className={`max-w-screen-lg mx-auto px-6 ${isMobile ? 'py-4' : 'py-8'}`}>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="border border-gray-200 rounded-xl h-64"></div>
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
                    onRsvp={handleRsvp}
                    showRsvpButtons={true}
                    isLoading={loadingPlanId === plan.id}
                    showBlurred={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl sm:text-6xl mb-4">🏖️</div>
                <h3 className="text-lg sm:text-xl font-medium text-[#005F73] mb-2">
                  No casual plans yet
                </h3>
                <p className="text-[#4A4A48] mb-4 text-sm sm:text-base">
                  Be the first to create a spontaneous meetup!
                </p>
                <Button 
                  onClick={() => navigate('/casual-plans/create')}
                  className="bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Plan
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CasualPlans;
