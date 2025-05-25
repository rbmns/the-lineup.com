
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCasualPlans } from '@/hooks/useCasualPlans';
import { CasualPlanCard } from '@/components/casual-plans/CasualPlanCard';
import { CreateCasualPlanForm } from '@/components/casual-plans/CreateCasualPlanForm';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { Button } from '@/components/ui/button';
import { CategoryPill } from '@/components/ui/category-pill';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CASUAL_PLAN_VIBES } from '@/types/casual-plans';

const CasualPlans: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { plans, isLoading, createPlan, joinPlan, leavePlan, isCreating, isJoining, isLeaving } = useCasualPlans();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  const handleLoginPrompt = () => {
    navigate('/login');
  };

  const handleCreatePlan = (planData: any) => {
    createPlan(planData);
    setShowCreateForm(false);
  };

  // Filter plans by selected vibe
  const filteredPlans = selectedVibe 
    ? plans.filter(plan => plan.vibe === selectedVibe)
    : plans;

  // Show different content for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EventsPageHeader 
          title="Casual Plans"
          subtitle="Find spontaneous meetups and create your own casual get-togethers"
        />

        <div className="container mx-auto px-4 py-4 md:py-6">
          {/* Mobile-optimized action bar */}
          <div className="space-y-4 mb-6">
            {/* Vibe filters - horizontal scroll on mobile */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Filter by vibe:</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <CategoryPill
                  category="all"
                  active={selectedVibe === null}
                  onClick={() => setSelectedVibe(null)}
                  noBorder={true}
                  className="flex-shrink-0"
                />
                {CASUAL_PLAN_VIBES.map((vibe) => (
                  <CategoryPill
                    key={vibe}
                    category={vibe}
                    active={selectedVibe === vibe}
                    onClick={() => setSelectedVibe(selectedVibe === vibe ? null : vibe)}
                    noBorder={true}
                    className="capitalize flex-shrink-0"
                  />
                ))}
              </div>
            </div>
            
            {/* Create button - full width on mobile */}
            <Button 
              onClick={handleLoginPrompt}
              className="w-full md:w-auto"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post a Plan
            </Button>
          </div>

          {/* Login prompt */}
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4 text-base">
              Sign in to see and create casual plans
            </p>
            <Button onClick={handleLoginPrompt} size="lg">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EventsPageHeader 
        title="Casual Plans"
        subtitle="Find spontaneous meetups and create your own casual get-togethers"
      />

      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Mobile-optimized action bar */}
        <div className="space-y-4 mb-6">
          {/* Vibe filters - horizontal scroll on mobile */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Filter by vibe:</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <CategoryPill
                category="all"
                active={selectedVibe === null}
                onClick={() => setSelectedVibe(null)}
                noBorder={true}
                className="flex-shrink-0"
              />
              {CASUAL_PLAN_VIBES.map((vibe) => (
                <CategoryPill
                  key={vibe}
                  category={vibe}
                  active={selectedVibe === vibe}
                  onClick={() => setSelectedVibe(selectedVibe === vibe ? null : vibe)}
                  noBorder={true}
                  className="capitalize flex-shrink-0"
                />
              ))}
            </div>
          </div>
          
          {/* Create button - full width on mobile */}
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="w-full md:w-auto"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post a Plan
          </Button>
        </div>

        {/* Plans grid - responsive */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-black"></div>
          </div>
        ) : filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredPlans.map((plan) => (
              <CasualPlanCard
                key={plan.id}
                plan={plan}
                onJoin={joinPlan}
                onLeave={leavePlan}
                isJoining={isJoining}
                isLeaving={isLeaving}
                isAuthenticated={isAuthenticated}
                onLoginPrompt={handleLoginPrompt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4 text-base">
              {selectedVibe 
                ? `No ${selectedVibe} plans found. Be the first to create one!`
                : 'No casual plans found. Be the first to create one!'
              }
            </p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              size="lg"
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create a Plan
            </Button>
          </div>
        )}
      </div>

      {/* Create form modal */}
      {showCreateForm && (
        <CreateCasualPlanForm
          onSubmit={handleCreatePlan}
          onCancel={() => setShowCreateForm(false)}
          isCreating={isCreating}
        />
      )}
    </div>
  );
};

export default CasualPlans;
