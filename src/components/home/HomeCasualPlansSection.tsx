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
    avatar: '🌅'
  }, {
    id: 2,
    title: 'guitar and campfire',
    date: 'Tue, 1 Jul',
    time: '20:30',
    interested: 3,
    avatar: '🎸'
  }];
  return <section className="py-16 bg-gradient-to-br from-secondary-50 via-white to-secondary-25 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-16 left-20 w-28 h-28 bg-vibrant-sunset/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-16 w-36 h-36 bg-vibrant-seafoam/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Create Spontaneous Plans</h2>
            <p className="text-lg text-neutral mb-6 max-w-3xl mx-auto leading-relaxed">
              Beyond organized events, create and join casual plans with fellow travelers and locals. 
              From impromptu beach walks to coffee meetups, make spontaneous connections happen.
            </p>
          </div>

          {/* Recent Plans Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-2xl font-semibold text-primary">Recent Casual Plans</h3>
            <Button asChild variant="ghost" className="self-start sm:self-auto text-neutral hover:text-primary hover:bg-secondary-25">
              <Link to="/casual-plans" className="flex items-center gap-2">
                See all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Casual Plans Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {casualPlans.map(plan => <Card key={plan.id} className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-neutral-25 hover:border-primary/20 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary-25 to-secondary-50 rounded-full flex items-center justify-center text-2xl shadow-md">
                        {plan.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary text-lg">{plan.title}</h4>
                        <p className="text-neutral text-sm">
                          {plan.date} • {plan.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral flex items-center gap-1">
                      <span className="w-2 h-2 bg-vibrant-coral rounded-full"></span>
                      {plan.interested} interested
                    </span>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-md">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>

          {/* Sign in prompt */}
          <div className="text-center py-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-neutral-25 shadow-lg">
            <p className="text-neutral text-lg mb-4">Sign in to see full details and join plans</p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-lg">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>

          {/* Create Plan CTA */}
          <div className="text-center">
            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-extended-oceanDeep-600 hover:from-primary/90 hover:to-extended-oceanDeep-700 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
              
            </Button>
          </div>
        </div>
      </div>
    </section>;
};