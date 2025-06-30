
import React from 'react';
import { useCasualPlans } from '@/hooks/useCasualPlans';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

  // For non-authenticated users, show improved login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-pure-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-h2 font-montserrat text-graphite-grey mb-6">
              Casual Plans
            </h1>
            <p className="text-body-base text-graphite-grey/80 font-lato mb-4">
              Spontaneous meetups and activities with fellow travelers
            </p>
            <div className="flex justify-center items-center gap-4 text-xl opacity-60">
              <span>🏖️</span>
              <span>⚡</span>
              <span>🌊</span>
            </div>
          </div>

          <Card className="bg-pure-white border border-mist-grey shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className={`bg-ocean-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
                <span className={`${isMobile ? 'text-xl' : 'text-2xl'} text-ocean-teal`}>🏖️</span>
              </div>
              <CardTitle className={`text-graphite-grey mb-2 font-montserrat ${isMobile ? 'text-lg' : 'text-xl'}`}>
                Join the community
              </CardTitle>
              <CardDescription className={`text-graphite-grey/80 font-lato ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Sign up to view locations, times, and connect with other members creating casual plans.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/signup')}
                  className="w-full bg-ocean-teal hover:bg-ocean-teal/90 text-pure-white font-montserrat"
                  size="default"
                >
                  Sign Up
                </Button>
                <Button 
                  onClick={() => navigate('/login')} 
                  variant="outline"
                  className="w-full border-ocean-teal text-ocean-teal hover:bg-ocean-teal hover:text-pure-white font-montserrat"
                  size="default"
                >
                  Log In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // For authenticated users, keep the existing layout
  return (
    <div className="min-h-screen bg-pure-white">
      {/* Header Section - Optimized for mobile above the fold */}
      <div className={`max-w-screen-lg mx-auto px-6 ${isMobile ? 'py-8' : 'py-12 sm:py-16'}`}>
        <div className="text-center">
          <h1 className={`font-bold text-graphite-grey mb-4 leading-tight font-montserrat ${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl lg:text-5xl'}`}>
            Casual <span className="text-ocean-teal">Plans</span>
          </h1>
          <p className={`text-graphite-grey/80 max-w-3xl mx-auto leading-relaxed font-lato ${isMobile ? 'text-base mb-6' : 'text-lg sm:text-xl mb-6'}`}>
            Spontaneous meetups and activities with fellow travelers
          </p>
          
          <Button 
            onClick={() => navigate('/casual-plans/create')}
            className="bg-ocean-teal hover:bg-ocean-teal/90 text-pure-white font-montserrat"
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
                <h3 className="text-lg sm:text-xl font-medium text-graphite-grey mb-2 font-montserrat">
                  No casual plans yet
                </h3>
                <p className="text-graphite-grey/80 mb-4 text-sm sm:text-base font-lato">
                  Be the first to create a spontaneous meetup!
                </p>
                <Button 
                  onClick={() => navigate('/casual-plans/create')}
                  className="bg-ocean-teal hover:bg-ocean-teal/90 text-pure-white font-montserrat"
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
