
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Coffee, Clock, MapPin, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCasualPlans } from '@/hooks/useCasualPlans';
import { formatFeaturedDate, formatTime } from '@/utils/date-formatting';
import { CategoryPill } from '@/components/ui/category-pill';

export const CasualPlansHomeSection = () => {
  const { isAuthenticated } = useAuth();
  const { plans, isLoading } = useCasualPlans();

  // Get first 3 plans for preview
  const previewPlans = plans.slice(0, 3);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold mb-4">Recent Casual Plans</h3>
                
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : previewPlans.length > 0 ? (
                  <div className="space-y-3">
                    {previewPlans.map((plan) => (
                      <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CategoryPill 
                              category={plan.vibe} 
                              size="sm"
                              className="capitalize text-xs px-2 py-1"
                            />
                            <h4 className="font-medium text-gray-900 text-sm">{plan.title}</h4>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatFeaturedDate(plan.date)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(plan.time)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {isAuthenticated ? (
                              <span>{plan.location}</span>
                            ) : (
                              <span className="text-gray-300">•••••••••</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {isAuthenticated ? (
                              <span>{plan.attendee_count || 0} interested</span>
                            ) : (
                              <span className="text-gray-300">••• interested</span>
                            )}
                          </div>
                        </div>
                        
                        {plan.description && (
                          <p className="text-sm text-gray-600 line-clamp-1">{plan.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Beach Walk & Coffee</h4>
                        <span className="text-xs text-gray-500">Today 6pm</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Anyone up for a sunset walk on the beach followed by coffee?</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {isAuthenticated ? (
                          <span className="text-xs text-gray-500">Zandvoort Beach</span>
                        ) : (
                          <span className="text-xs text-gray-300">•••••••••••</span>
                        )}
                        <span className="text-xs text-gray-400">•</span>
                        {isAuthenticated ? (
                          <span className="text-xs text-gray-500">3 interested</span>
                        ) : (
                          <span className="text-xs text-gray-300">••• interested</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Local Food Tour</h4>
                        <span className="text-xs text-gray-500">Tomorrow 7pm</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Let's explore the best local spots for dinner!</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {isAuthenticated ? (
                          <span className="text-xs text-gray-500">City Center</span>
                        ) : (
                          <span className="text-xs text-gray-300">•••••••••</span>
                        )}
                        <span className="text-xs text-gray-400">•</span>
                        {isAuthenticated ? (
                          <span className="text-xs text-gray-500">5 interested</span>
                        ) : (
                          <span className="text-xs text-gray-300">••• interested</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Morning Surf Check</h4>
                        <span className="text-xs text-gray-500">Sat 7am</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Early morning surf session if conditions are good</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {isAuthenticated ? (
                          <span className="text-xs text-gray-500">South Beach</span>
                        ) : (
                          <span className="text-xs text-gray-300">••••••••••</span>
                        )}
                        <span className="text-xs text-gray-400">•</span>
                        {isAuthenticated ? (
                          <span className="text-xs text-gray-500">2 interested</span>
                        ) : (
                          <span className="text-xs text-gray-300">••• interested</span>
                        )}
                      </div>
                    </div>
                  </div>
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
