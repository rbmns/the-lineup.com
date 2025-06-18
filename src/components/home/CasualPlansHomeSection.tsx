
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Coffee, Clock, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCasualPlans } from '@/hooks/useCasualPlans';
import { CasualPlanPreviewCard } from './CasualPlanPreviewCard';
import { CasualPlansMockData } from './CasualPlansMockData';

export const CasualPlansHomeSection = () => {
  const { isAuthenticated } = useAuth();
  const { plans, isLoading } = useCasualPlans();
  const navigate = useNavigate();

  const previewPlans = plans.slice(0, 3);

  const handlePlanClick = (planId: string) => {
    navigate(`/casual-plans/${planId}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Content */}
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-4">Create Spontaneous Plans</h2>
              <p className="text-lg text-gray-600 mb-6">
                Beyond organized events, create and join casual plans with fellow travelers and locals. 
                From impromptu beach walks to coffee meetups, make spontaneous connections happen.
              </p>
              
              {/* Feature highlights */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Coffee className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-gray-700">Coffee chats, beach walks, local explorations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Last-minute plans and spontaneous activities</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Connect with locals and travelers nearby</span>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
                <Link to="/casual-plans">
                  Explore Casual Plans
                </Link>
              </Button>
            </div>
            
            {/* Plans preview */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Casual Plans</h3>
                  <Link 
                    to="/casual-plans" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    See all →
                  </Link>
                </div>
                
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-3 md:p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : previewPlans.length > 0 ? (
                  <div className="space-y-3">
                    {previewPlans.map((plan) => (
                      <CasualPlanPreviewCard
                        key={plan.id}
                        plan={plan}
                        isAuthenticated={isAuthenticated}
                        onClick={handlePlanClick}
                      />
                    ))}
                  </div>
                ) : (
                  <CasualPlansMockData isAuthenticated={isAuthenticated} />
                )}
                
                {!isAuthenticated && (
                  <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500 mb-2">
                      <Link to="/login" className="text-blue-600 hover:text-blue-800 underline">
                        Sign in
                      </Link> to see full details and join plans
                    </p>
                  </div>
                )}
              </div>
              
              {/* Floating add button mockup */}
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
