import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types';
import { toast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  label: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    id: 'location',
    label: 'Set your location',
    description: 'Find events happening near you.',
  },
  {
    id: 'interests',
    label: 'Choose your interests',
    description: 'Get personalized event recommendations.',
  },
  {
    id: 'profile',
    label: 'Customize your profile',
    description: 'Let others know what you\'re up to.',
  },
];

export const useOnboarding = (profile: UserProfile | null) => {
  const [currentStep, setCurrentStep] = useState<string>(steps[0].id);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const { updateProfile } = useAuth();

  useEffect(() => {
    if (profile?.onboarded) {
      setIsComplete(true);
      return;
    }
    
    try {
      if (profile?.onboarding_data) {
        const savedData = JSON.parse(profile.onboarding_data as string);
        setCompletedSteps(savedData.completedSteps || []);
        setCurrentStep(savedData.currentStep || steps[0].id);
      }
    } catch (error) {
      console.error('Error parsing onboarding data:', error);
    }
  }, [profile]);

  useEffect(() => {
    if (completedSteps.length === steps.length) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [completedSteps]);

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStepId = steps[currentIndex + 1].id;
      setCurrentStep(nextStepId);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      const prevStepId = steps[currentIndex - 1].id;
      setCurrentStep(prevStepId);
    }
  };

  const markComplete = async (user: User | null) => {
    if (!user) return false;
    
    try {
      const updatedProfile: Partial<UserProfile> = {
        onboarded: true,
        onboarding_data: JSON.stringify({
          completedSteps: steps.map(s => s.id),
          currentStep: steps[steps.length - 1].id
        })
      };
      
      const { error } = await updateProfile(updatedProfile);
      
      if (error) {
        toast({
          title: "Error",
          description: "Could not update profile",
          variant: "destructive"
        });
        return false;
      }
      
      setCompletedSteps(steps.map(s => s.id));
      setIsComplete(true);
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  };

  const saveProgress = async (user: User | null, completedSteps: string[], currentStep: string) => {
    if (!user) return false;
    
    try {
      const updatedProfile: Partial<UserProfile> = {
        onboarding_data: JSON.stringify({
          completedSteps,
          currentStep,
        })
      };
      
      const { error } = await updateProfile(updatedProfile);
      
      if (error) {
        toast({
          title: "Error",
          description: "Could not save onboarding progress",
          variant: "destructive"
        });
        return false;
      }
      
      setCompletedSteps(completedSteps);
      setCurrentStep(currentStep);
      return true;
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
      return false;
    }
  };

  const markOnboardingComplete = async (user: User | null) => {
    if (!user) return false;
    
    try {
      const updatedProfile: Partial<UserProfile> = {
        onboarded: true,
        onboarding_data: JSON.stringify({
          completedSteps: steps.map(s => s.id),
          currentStep: steps[steps.length - 1].id
        })
      };
      
      const { error } = await updateProfile(updatedProfile);
      
      if (error) {
        toast({
          title: "Error",
          description: "Could not complete onboarding",
          variant: "destructive"
        });
        return false;
      }
      
      setCompletedSteps(steps.map(s => s.id));
      setIsComplete(true);
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  };

  return {
    steps,
    currentStep,
    completedSteps,
    isComplete,
    nextStep,
    prevStep,
    markComplete,
    saveProgress,
    markOnboardingComplete
  };
};
