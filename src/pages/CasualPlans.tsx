
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, User, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/ui/page-header';
import { useCasualPlans } from '@/hooks/useCasualPlans';
import { CasualPlanCard } from '@/components/casual-plans/CasualPlanCard';

const CasualPlans = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { plans, isLoading, joinPlan, leavePlan, markInterested, unmarkInterested } = useCasualPlans();
  const [joiningPlanId, setJoiningPlanId] = useState<string | null>(null);
  const [leavingPlanId, setLeavingPlanId] = useState<string | null>(null);
  const [markingInterestedPlanId, setMarkingInterestedPlanId] = useState<string | null>(null);
  const [unmarkingInterestedPlanId, setUnmarkingInterestedPlanId] = useState<string | null>(null);

  const handleJoinPlan = async (planId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setJoiningPlanId(planId);
    try {
      await joinPlan(planId);
      toast({
        title: "Success",
        description: "You've joined the casual plan!",
      });
    } catch (error) {
      console.error('Error joining plan:', error);
      toast({
        title: "Error",
        description: "Failed to join the plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setJoiningPlanId(null);
    }
  };

  const handleLeavePlan = async (planId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLeavingPlanId(planId);
    try {
      await leavePlan(planId);
      toast({
        title: "Success",
        description: "You've left the casual plan.",
      });
    } catch (error) {
      console.error('Error leaving plan:', error);
      toast({
        title: "Error",
        description: "Failed to leave the plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLeavingPlanId(null);
    }
  };

  const handleMarkInterested = async (planId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setMarkingInterestedPlanId(planId);
    try {
      await markInterested(planId);
      toast({
        title: "Success",
        description: "Updated your interest in this plan!",
      });
    } catch (error) {
      console.error('Error updating interest:', error);
      toast({
        title: "Error",
        description: "Failed to update interest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setMarkingInterestedPlanId(null);
    }
  };

  const handleUnmarkInterested = async (planId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setUnmarkingInterestedPlanId(planId);
    try {
      await unmarkInterested(planId);
      toast({
        title: "Success",
        description: "You've unmarked this plan as interesting.",
      });
    } catch (error) {
      console.error('Error unmarking as interested:', error);
      toast({
        title: "Error",
        description: "Failed to unmark as interested. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUnmarkingInterestedPlanId(null);
    }
  };

  const handleLoginPrompt = () => {
    navigate('/login');
  };

  return (
    <div className="w-full">
      <Helmet>
        <title>the lineup | Join and create Casual Plans from others nearby</title>
        <meta name="description" content="Explore the best surf, yoga, and music events in coastal towns. Join the flow with the-lineup.com." />
        <meta property="og:title" content="the lineup | Join and create Casual Plans with others nearby" />
        <meta property="og:description" content="Explore the best surf, yoga, and music events in coastal towns. Join the flow with the-lineup.com." />
        <meta property="og:image" content="https://raw.githubusercontent.com/rbmns/images/refs/heads/main/lineup/marketing/casualevents.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      {/* Hero Section */}
      <PageHeader 
        title="Casual Plans"
        subtitle="Create and join spontaneous plans with travelers and locals. From beach walks to coffee meetups."
      />

      {/* Main Content */}
      <div className="px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Create plan button for authenticated users */}
          {isAuthenticated && (
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Available Plans</h2>
              <Button asChild>
                <Link to="/casual-plans/create">Create a New Plan</Link>
              </Button>
            </div>
          )}

          {/* Plans grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-48"></div>
                </div>
              ))}
            </div>
          ) : plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map(plan => (
                <CasualPlanCard
                  key={plan.id}
                  plan={plan}
                  onJoin={handleJoinPlan}
                  onLeave={handleLeavePlan}
                  onMarkInterested={handleMarkInterested}
                  onUnmarkInterested={handleUnmarkInterested}
                  isJoining={joiningPlanId === plan.id}
                  isLeaving={leavingPlanId === plan.id}
                  isMarkingInterested={markingInterestedPlanId === plan.id}
                  isUnmarkingInterested={unmarkingInterestedPlanId === plan.id}
                  isAuthenticated={isAuthenticated}
                  onLoginPrompt={handleLoginPrompt}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No casual plans yet</h3>
              <p className="text-gray-600 mb-6">Be the first to create a casual plan in your area!</p>
              {isAuthenticated ? (
                <Button asChild>
                  <Link to="/casual-plans/create">Create a New Plan</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/login">Sign in to create plans</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CasualPlans;
