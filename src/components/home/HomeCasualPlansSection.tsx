import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
export const HomeCasualPlansSection: React.FC = () => {
  const casualPlans = [{
    id: 1,
    title: 'Sunset watch & beers',
    date: 'Thu, 26 Jun',
    time: '12:00',
    interested: 3,
    avatar: '••••••'
  }, {
    id: 2,
    title: 'guitar and campfire',
    date: 'Tue, 1 Jul',
    time: '20:30',
    interested: 3,
    avatar: '••••••'
  }];
  return <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 md:space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-semibold tracking-tight mb-4 text-gray-900">Create Spontaneous Plans</h2>
            <p className="text-base leading-7 text-gray-700 mb-6 max-w-3xl">
              Beyond organized events, create and join casual plans with fellow travelers and locals. 
              From impromptu beach walks to coffee meetups, make spontaneous connections happen.
            </p>
          </div>

          {/* Recent Plans Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-2xl font-semibold text-gray-900">Recent Casual Plans</h3>
            <Button asChild variant="ghost" className="self-start sm:self-auto text-gray-700 hover:text-gray-900">
              <Link to="/casual-plans" className="flex items-center gap-2">
                See all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Casual Plans Grid - properly spaced */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {casualPlans.map(plan => <Card key={plan.id} className="hover:shadow-md transition-shadow bg-white border border-gray-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                        {plan.avatar}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{plan.title}</h4>
                        <p className="text-sm text-gray-600">
                          {plan.date} • {plan.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {plan.interested} interested
                    </span>
                    <Button size="sm" variant="outline">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>

          {/* Sign in prompt */}
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-700 mb-4">Sign in to see full details and join plans</p>
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>

          {/* Create Plan CTA */}
          <div className="text-center">
            <Button asChild size="lg" className="rounded-full bg-gray-900 hover:bg-gray-800">
              
            </Button>
          </div>
        </div>
      </div>
    </section>;
};