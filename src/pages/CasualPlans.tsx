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
  const {
    user,
    isAuthenticated
  } = useAuth();
  const {
    plans,
    isLoading,
    rsvpToPlan,
    loadingPlanId
  } = useCasualPlans();
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
    return <div className="min-h-screen bg-pure-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
              
              
              
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-3">
                <Button onClick={() => navigate('/signup')} className="w-full bg-ocean-teal hover:bg-ocean-teal/90 text-pure-white font-montserrat" size="default">
                  Sign Up
                </Button>
                <Button onClick={() => navigate('/login')} variant="outline" className="w-full border-ocean-teal text-ocean-teal hover:bg-ocean-teal hover:text-pure-white font-montserrat" size="default">
                  Log In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>;
  }

  // For authenticated users, keep the existing layout
  return <div className="min-h-screen bg-pure-white">
      {/* Header Section - Optimized for mobile above the fold */}
      <div className={`max-w-screen-lg mx-auto px-6 ${isMobile ? 'py-8' : 'py-12 sm:py-16'}`}>
        <div className="text-center">
          <h1 className={`font-bold text-graphite-grey mb-4 leading-tight font-montserrat ${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl lg:text-5xl'}`}>
            Casual <span className="text-ocean-teal">Plans</span>
          </h1>
          <p className={`text-graphite-grey/80 max-w-3xl mx-auto leading-relaxed font-lato ${isMobile ? 'text-base mb-6' : 'text-lg sm:text-xl mb-6'}`}>Spontaneous meetups and activities. Invite people to join for sunset watching or a picknick.</p>
          
          <Button onClick={() => navigate('/casual-plans/create')} className="bg-ocean-teal hover:bg-ocean-teal/90 text-pure-white font-montserrat">
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </div>

      
    </div>;
};
export default CasualPlans;