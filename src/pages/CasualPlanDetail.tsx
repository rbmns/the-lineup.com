
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCasualPlanDetail } from '@/hooks/useCasualPlanDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, MapPin, Users, MessageCircle, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { formatFeaturedDate, formatTime } from '@/utils/date-formatting';
import { CategoryPill } from '@/components/ui/category-pill';
import { Helmet } from 'react-helmet-async';

const CasualPlanDetail = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    plan, 
    isLoading, 
    error, 
    joinPlan, 
    leavePlan, 
    isJoining, 
    isLeaving 
  } = useCasualPlanDetail(planId);

  const handleBack = () => {
    navigate('/casual-plans');
  };

  const handleJoinLeave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!plan) return;

    try {
      if (plan.user_attending) {
        await leavePlan(plan.id);
        toast({
          title: "Left plan",
          description: "You've left this casual plan.",
        });
      } else {
        await joinPlan(plan.id);
        toast({
          title: "Joined plan!",
          description: "You're now going to this casual plan.",
        });
      }
    } catch (error) {
      console.error('Error with RSVP:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoginPrompt = () => {
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black"></div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plan not found</h1>
          <Button onClick={handleBack}>Back to Casual Plans</Button>
        </div>
      </div>
    );
  }

  const isCreator = user?.id === plan.creator_id;
  const attendeeCount = plan.attendee_count || 0;
  const maxAttendees = plan.max_attendees;
  const spotsLeft = maxAttendees ? maxAttendees - attendeeCount : null;
  const isFull = maxAttendees && attendeeCount >= maxAttendees;
  const fillPercentage = maxAttendees ? Math.round((attendeeCount / maxAttendees) * 100) : 67;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{plan.title} | Casual Plans</title>
        <meta name="description" content={plan.description || `Join ${plan.title} - a ${plan.vibe} casual plan in ${plan.location}`} />
      </Helmet>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-semibold truncate">{plan.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Desktop Back Button */}
          <div className="hidden lg:block mb-6">
            <Button variant="ghost" onClick={handleBack} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Casual Plans
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Organizer */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-2xl lg:text-3xl font-bold">{plan.title}</h1>
                  <CategoryPill 
                    category={plan.vibe} 
                    size="sm"
                    className="capitalize flex-shrink-0 ml-4"
                  />
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={plan.creator_profile?.avatar_url?.[0]} 
                      alt={plan.creator_profile?.username}
                    />
                    <AvatarFallback>
                      {plan.creator_profile?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{plan.creator_profile?.username || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">Organizer</p>
                  </div>
                </div>
              </div>

              {/* Plan Details */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Plan Details</h2>
                
                {plan.description && (
                  <p className="text-gray-700 mb-6 leading-relaxed">{plan.description}</p>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-gray-600">{formatFeaturedDate(plan.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-gray-600">{formatTime(plan.time)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{plan.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discussion Section */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Discussion</h2>
                  <Badge variant="secondary">2</Badge>
                </div>

                {/* Mock discussion messages */}
                <div className="space-y-4 mb-6">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Christi</span>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-700">Looking forward to this! Is there parking nearby?</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>K</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Koen</span>
                        <span className="text-xs text-gray-500">1 hour ago</span>
                      </div>
                      <p className="text-sm text-gray-700">I'll bring some extra equipment if anyone needs it.</p>
                    </div>
                  </div>
                </div>

                {/* Comment input */}
                {isAuthenticated ? (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user?.user_metadata?.username?.[0]?.toUpperCase() || 'Y'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask a question or leave a comment..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <Button size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600 mb-2">
                      <Button variant="link" onClick={handleLoginPrompt} className="p-0 h-auto">
                        Sign in
                      </Button> to join the discussion
                    </p>
                  </div>
                )}
              </div>

              {/* Attendees Section */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Attendees</h2>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Event Attendees</h3>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-500">All</span>
                      <span className="font-medium">8</span>
                      <span className="text-gray-500">Friends</span>
                      <span className="font-medium">2</span>
                      <span className="text-gray-500">Suggestions</span>
                      <span className="font-medium">6</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-medium">Going</span>
                      <Badge variant="secondary">{attendeeCount}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      {/* Mock attendees */}
                      {[
                        { name: 'Christi', avatar: null },
                        { name: 'Koen', avatar: null },
                        { name: 'Saar', avatar: null },
                        { name: 'Yahya', avatar: null },
                        { name: 'Alex', avatar: null },
                        { name: 'Michael', avatar: null },
                      ].slice(0, attendeeCount).map((attendee, index) => (
                        <div key={index} className="text-center">
                          <Avatar className="h-12 w-12 mx-auto mb-2">
                            <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                          </Avatar>
                          <p className="text-xs font-medium">{attendee.name}</p>
                          {attendee.name === 'Koen' && <p className="text-xs text-gray-500">Friend</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-medium">Interested</span>
                      <Badge variant="secondary">2</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      <div className="text-center">
                        <Avatar className="h-12 w-12 mx-auto mb-2">
                          <AvatarFallback>D</AvatarFallback>
                        </Avatar>
                        <p className="text-xs font-medium">Deniz</p>
                      </div>
                      <div className="text-center">
                        <Avatar className="h-12 w-12 mx-auto mb-2">
                          <AvatarFallback>E</AvatarFallback>
                        </Avatar>
                        <p className="text-xs font-medium">Emma</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Join this plan */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold mb-4">Join this plan</h3>
                
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        onClick={handleJoinLeave}
                        disabled={isJoining || isLeaving || (isFull && !plan.user_attending)}
                        className={`flex-1 ${
                          plan.user_attending 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        variant={plan.user_attending ? "default" : "outline"}
                      >
                        {isJoining || isLeaving ? (
                          "..."
                        ) : plan.user_attending ? (
                          <>
                            <div className="w-4 h-4 mr-2 bg-white rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            </div>
                            Going
                          </>
                        ) : isFull ? (
                          "Full"
                        ) : (
                          "Going"
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                        disabled={isJoining || isLeaving}
                      >
                        Interested
                      </Button>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        {attendeeCount} of {maxAttendees || 12} spots filled
                      </p>
                      <p className="text-sm font-medium">{fillPercentage}%</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button onClick={handleLoginPrompt} className="w-full" variant="outline">
                      Sign in to RSVP
                    </Button>
                  </div>
                )}
              </div>

              {/* Weather Forecast */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Weather Forecast</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold">24°C</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunny</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{formatFeaturedDate(plan.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wind</span>
                    <span>12 km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Humidity</span>
                    <span>65%</span>
                  </div>
                </div>
              </div>

              {/* Similar Plans */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold mb-4">Similar Plans</h3>
                <p className="text-sm text-gray-600">No similar plans found.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasualPlanDetail;
