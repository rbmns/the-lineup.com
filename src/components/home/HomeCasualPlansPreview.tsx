
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CasualPlanCard } from '@/components/casual-plans/CasualPlanCard';
import { CasualPlan } from '@/types/casual-plans';

interface HomeCasualPlansPreviewProps {
  plans: CasualPlan[] | undefined;
  isLoading: boolean;
}

export const HomeCasualPlansPreview: React.FC<HomeCasualPlansPreviewProps> = ({
  plans,
  isLoading
}) => {
  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-primary mb-4">
              Casual Plans
            </h2>
            <p className="text-lg text-neutral">
              Join spontaneous activities and meet new people
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-primary mb-4">
            Casual Plans
          </h2>
          <p className="text-lg text-neutral mb-8">
            No casual plans available at the moment
          </p>
          <Link to="/casual-plans">
            <Button>View All Plans</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold tracking-tight text-primary mb-4">
            Casual Plans
          </h2>
          <p className="text-lg text-neutral">
            Join spontaneous activities and meet new people
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {plans.slice(0, 3).map((plan) => (
            <CasualPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/casual-plans">
            <Button variant="outline" size="lg">
              View All Casual Plans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
