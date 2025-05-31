
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Coffee, Clock, MapPin, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCasualPlans } from '@/hooks/useCasualPlans';
import { formatFeaturedDate, formatTime } from '@/utils/date-formatting';
import { CategoryPill } from '@/components/ui/category-pill';

export const CasualPlansHomeSection = () => {
  const { isAuthenticated } = useAuth();
  const { plans, isLoading } = useCasualPlans();
  const navigate = useNavigate();

  // Get first 3 plans for preview
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
                      <div 
                        key={plan.id} 
                        className="border border-gray-200 rounded-lg p-3 md:p-4 cursor-pointer hover:border-gray-300 transition-colors"
                        onClick={() => handlePlanClick(plan.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {isAuthenticated ? (
                              <CategoryPill 
                                category={plan.vibe} 
                                size="sm"
                                className="capitalize text-xs px-2 py-1 flex-shrink-0"
                              />
                            ) : (
                              <div className="bg-gray-200 text-gray-400 px-2 py-1 rounded text-xs flex-shrink-0">
                                ••••••
                              </div>
                            )}
                            <h4 className="font-medium text-gray-900 text-sm truncate">{plan.title}</h4>
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {formatFeaturedDate(plan.date)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 md:gap-4 text-xs text-gray-500 mb-2 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(plan.time)}</span>
                          </div>
                          <div className="flex items-center gap-1 min-w-0">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            {isAuthenticated ? (
                              <span className="truncate">{plan.location}</span>
                            ) : (
                              <span className="text-gray-300">••••••••••••••••</span>
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
                        
                        {/* Only show description for authenticated users */}
                        {isAuthenticated && plan.description && (
                          <p className="text-sm text-gray-600 line-clamp-1">{plan.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Mock data for non-authenticated users or when no plans */}
                    <div 
                      className="border border-gray-200 rounded-lg p-3 md:p-4 cursor-pointer hover:border-gray-300 transition-colors"
                      onClick={() => navigate('/casual-plans')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {isAuthenticated ? (
                            <CategoryPill 
                              category="beach" 
                              size="sm"
                              className="capitalize text-xs px-2 py-1 flex-shrink-0"
                            />
                          ) : (
                            <div className="bg-gray-200 text-gray-400 px-2 py-1 rounded text-xs flex-shrink-0">
                              ••••••
                            </div>
                          )}
                          <h4 className="font-medium text-gray-900 text-sm truncate">Beach Walk & Coffee</h4>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">Today 6pm</span>
                      </div>
                      <div className="flex items-center gap-3 md:gap-4 text-xs text-gray-500 mb-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>18:00</span>
                        </div>
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {isAuthenticated ? (
                            <span className="truncate">Zandvoort Beach</span>
                          ) : (
                            <span className="text-gray-300">••••••••••••••••</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {isAuthenticated ? (
                            <span>3 interested</span>
                          ) : (
                            <span className="text-gray-300">••• interested</span>
                          )}
                        </div>
                      </div>
                      {isAuthenticated && (
                        <p className="text-sm text-gray-600 line-clamp-1">Anyone up for a sunset walk on the beach followed by coffee?</p>
                      )}
                    </div>
                    
                    <div 
                      className="border border-gray-200 rounded-lg p-3 md:p-4 cursor-pointer hover:border-gray-300 transition-colors"
                      onClick={() => navigate('/casual-plans')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {isAuthenticated ? (
                            <CategoryPill 
                              category="food" 
                              size="sm"
                              className="capitalize text-xs px-2 py-1 flex-shrink-0"
                            />
                          ) : (
                            <div className="bg-gray-200 text-gray-400 px-2 py-1 rounded text-xs flex-shrink-0">
                              ••••••
                            </div>
                          )}
                          <h4 className="font-medium text-gray-900 text-sm truncate">Local Food Tour</h4>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">Tomorrow 7pm</span>
                      </div>
                      <div className="flex items-center gap-3 md:gap-4 text-xs text-gray-500 mb-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>19:00</span>
                        </div>
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {isAuthenticated ? (
                            <span className="truncate">City Center</span>
                          ) : (
                            <span className="text-gray-300">••••••••••••••••</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {isAuthenticated ? (
                            <span>5 interested</span>
                          ) : (
                            <span className="text-gray-300">••• interested</span>
                          )}
                        </div>
                      </div>
                      {isAuthenticated && (
                        <p className="text-sm text-gray-600 line-clamp-1">Let's explore the best local spots for dinner!</p>
                      )}
                    </div>
                    
                    <div 
                      className="border border-gray-200 rounded-lg p-3 md:p-4 cursor-pointer hover:border-gray-300 transition-colors"
                      onClick={() => navigate('/casual-plans')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {isAuthenticated ? (
                            <CategoryPill 
                              category="surf" 
                              size="sm"
                              className="capitalize text-xs px-2 py-1 flex-shrink-0"
                            />
                          ) : (
                            <div className="bg-gray-200 text-gray-400 px-2 py-1 rounded text-xs flex-shrink-0">
                              ••••••
                            </div>
                          )}
                          <h4 className="font-medium text-gray-900 text-sm truncate">Morning Surf Check</h4>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">Sat 7am</span>
                      </div>
                      <div className="flex items-center gap-3 md:gap-4 text-xs text-gray-500 mb-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>07:00</span>
                        </div>
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {isAuthenticated ? (
                            <span className="truncate">South Beach</span>
                          ) : (
                            <span className="text-gray-300">••••••••••••••••</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {isAuthenticated ? (
                            <span>2 interested</span>
                          ) : (
                            <span className="text-gray-300">••• interested</span>
                          )}
                        </div>
                      </div>
                      {isAuthenticated && (
                        <p className="text-sm text-gray-600 line-clamp-1">Early morning surf session if conditions are good</p>
                      )}
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
