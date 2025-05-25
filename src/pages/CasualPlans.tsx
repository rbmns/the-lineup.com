
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

        <div className="container mx-auto px-4 py-6">
          {/* Action bar with disabled button for non-auth users */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              {/* Vibe filters */}
              <div className="flex flex-wrap gap-2">
                <CategoryPill
                  category="all"
                  active={selectedVibe === null}
                  onClick={() => setSelectedVibe(null)}
                  noBorder={true}
                />
                {CASUAL_PLAN_VIBES.map((vibe) => (
                  <CategoryPill
                    key={vibe}
                    category={vibe}
                    active={selectedVibe === vibe}
                    onClick={() => setSelectedVibe(selectedVibe === vibe ? null : vibe)}
                    noBorder={true}
                    className="capitalize"
                  />
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleLoginPrompt}
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post a Plan
            </Button>
          </div>

          {/* Login prompt */}
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Sign in to see and create casual plans
            </p>
            <Button onClick={handleLoginPrompt}>
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

      <div className="container mx-auto px-4 py-6">
        {/* Action bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            {/* Vibe filters */}
            <div className="flex flex-wrap gap-2">
              <CategoryPill
                category="all"
                active={selectedVibe === null}
                onClick={() => setSelectedVibe(null)}
                noBorder={true}
              />
              {CASUAL_PLAN_VIBES.map((vibe) => (
                <CategoryPill
                  key={vibe}
                  category={vibe}
                  active={selectedVibe === vibe}
                  onClick={() => setSelectedVibe(selectedVibe === vibe ? null : vibe)}
                  noBorder={true}
                  className="capitalize"
                />
              ))}
            </div>
          </div>
          
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post a Plan
          </Button>
        </div>

        {/* Plans grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-black"></div>
          </div>
        ) : filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <p className="text-gray-600 mb-4">
              {selectedVibe 
                ? `No ${selectedVibe} plans found. Be the first to create one!`
                : 'No casual plans found. Be the first to create one!'
              }
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
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
