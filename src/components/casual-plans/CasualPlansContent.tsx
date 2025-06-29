
import React from 'react';
import { useCasualPlans } from '@/hooks/useCasualPlans';
import { useAuth } from '@/contexts/AuthContext';
import { CasualPlanCard } from './CasualPlanCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LogIn, Plus } from 'lucide-react';

export const CasualPlansContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { plans, isLoading, rsvpToPlan, loadingPlanId } = useCasualPlans();

  // Mock data for non-authenticated users (only titles)
  const mockPlansForNonAuth = [
    { id: '1', title: 'Beach Volleyball Session' },
    { id: '2', title: 'Morning Coffee Walk' },
    { id: '3', title: 'Sunset Surf Session' },
    { id: '4', title: 'Yoga in the Park' },
    { id: '5', title: 'Local Food Tour' },
  ];

  const handleRsvp = async (planId: string, status: 'Going' | 'Interested') => {
    const success = await rsvpToPlan(planId, status);
    return success;
  };

  if (isLoading && isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Login Prompt Section */}
        <div className="auth-container mb-8 text-center shadow-sm max-w-2xl mx-auto">
          <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="auth-heading text-xl sm:text-2xl mb-2">
            Sign in to see full details
          </h3>
          <p className="auth-subtext mb-6 text-sm sm:text-base">
            Join our community to view locations, times, and connect with other members
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button asChild className="btn-primary">
              <Link to="/login">
                Sign In
              </Link>
            </Button>
            <Button variant="outline" asChild className="btn-outline">
              <Link to="/signup">
                Create Account
              </Link>
            </Button>
          </div>
        </div>

        {/* Preview Cards - Titles Only */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-6">Recent Casual Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {mockPlansForNonAuth.map((plan) => (
              <div key={plan.id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:border-gray-300 transition-colors shadow-sm">
                <h3 className="font-medium text-primary mb-4 text-sm sm:text-base">{plan.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <span>📅 ••••••••••</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <span>⏰ ••••••••</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <span>📍 ••••••••••••••••••••</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 text-center">
                  <p className="text-xs auth-subtext mb-2">
                    <Link to="/login" className="text-primary hover:text-primary/80 underline">
                      Sign in
                    </Link>{' '}
                    to see full details
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-secondary/10 rounded-2xl p-6 sm:p-8 text-center">
          <Plus className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-2">
            Have a casual plan in mind?
          </h3>
          <p className="auth-subtext mb-6 text-sm sm:text-base">
            Create an account to post your own casual meetups and connect with locals
          </p>
          <Button asChild size="lg" className="btn-primary">
            <Link to="/signup">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Authenticated user content
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Create Plan CTA */}
      <div className="mb-8 text-center">
        <Button asChild size="lg" className="btn-primary">
          <Link to="/casual-plans/create">
            <Plus className="h-5 w-5 mr-2" />
            Create Casual Plan
          </Link>
        </Button>
      </div>

      {/* Plans Grid */}
      {plans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan) => (
            <CasualPlanCard
              key={plan.id}
              plan={plan}
              onRsvp={handleRsvp}
              showRsvpButtons={true}
              isLoading={loadingPlanId === plan.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl sm:text-6xl mb-4">🏖️</div>
          <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-2">
            No casual plans yet
          </h3>
          <p className="auth-subtext mb-6 text-sm sm:text-base">
            Be the first to create a casual meetup in your area
          </p>
          <Button asChild className="btn-primary">
            <Link to="/casual-plans/create">
              Create the First Plan
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};
