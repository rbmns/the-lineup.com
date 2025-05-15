
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '@/types';
import { toast } from '../hooks/use-toast';

export interface OnboardingData {
  username: string;
  avatar_url: string;
  location: string;
  location_category: string;
  status: string;
  status_details: string;
  tagline: string;
}

interface OnboardingStepFields {
  step1: string[];
  step2: string[];
  step3: string[];
}

// Update these definitions as needed
interface OnboardingStep {
  title: string;
  description: string;
  type: string;
  fields: string[];
}

interface UseOnboardingReturn {
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  stepFields: OnboardingStepFields;
  onboardingData: Partial<OnboardingData>;
  loading: boolean;
  progress: number;
  completed: boolean;
  error: string | null;
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  moveToNextStep: () => void;
  moveToPreviousStep: () => void;
  submitCurrentStep: () => Promise<boolean>;
  completeOnboarding: () => Promise<boolean>;
}

export const useOnboarding = (): UseOnboardingReturn => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define steps for onboarding
  const steps: OnboardingStep[] = [
    {
      title: 'Create Your Profile',
      description: 'Let\'s set up your profile to help connect with others',
      type: 'profile',
      fields: ['username', 'avatar_url']
    },
    {
      title: 'Your Location',
      description: 'Share your location to discover nearby events and people',
      type: 'location',
      fields: ['location', 'location_category']
    },
    {
      title: 'Your Status',
      description: 'Let others know about your current status',
      type: 'status',
      fields: ['status', 'status_details', 'tagline']
    },
  ];

  const totalSteps = steps.length;

  // Define fields for each step
  const stepFields: OnboardingStepFields = {
    step1: ['username', 'avatar_url'],
    step2: ['location', 'location_category'],
    step3: ['status', 'status_details', 'tagline'],
  };

  // Calculate progress
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Check if onboarding is completed
  const completed = currentStep >= totalSteps;

  // Move to next step
  const moveToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move to previous step
  const moveToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit current step
  const submitCurrentStep = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to complete onboarding.',
        variant: 'destructive'
      });
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Create partial data with only the fields for the current step
      const stepIndex = currentStep;
      const stepKey = `step${stepIndex + 1}` as keyof OnboardingStepFields;
      const fieldsToUpdate = stepFields[stepKey];
      
      const updatedData: Partial<UserProfile> = {};
      
      fieldsToUpdate.forEach(field => {
        if (field in onboardingData) {
          (updatedData as any)[field] = (onboardingData as any)[field];
        }
      });

      // Save data to database
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Move to the next step if not on the last step
      if (currentStep < totalSteps - 1) {
        moveToNextStep();
      }

      toast({
        title: 'Step completed',
        description: 'Your information has been saved successfully.'
      });

      return true;
    } catch (error: any) {
      console.error('Error submitting step:', error);
      setError(error.message);
      
      toast({
        title: 'Error',
        description: `Failed to save your information: ${error.message}`,
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Complete onboarding
  const completeOnboarding = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to complete onboarding.',
        variant: 'destructive'
      });
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the fields for the current step
      const stepIndex = currentStep;
      const stepKey = `step${stepIndex + 1}` as keyof OnboardingStepFields;
      const fieldsToUpdate = stepFields[stepKey];
      
      const updatedData: Partial<UserProfile> = {
        onboarded: true,
        onboarding_data: JSON.stringify(onboardingData)
      };
      
      // Also include the fields from the current step
      fieldsToUpdate.forEach(field => {
        if (field in onboardingData) {
          (updatedData as any)[field] = (onboardingData as any)[field];
        }
      });

      // Save data to database
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      toast({
        title: 'Onboarding completed',
        description: 'Your profile has been set up successfully.'
      });

      return true;
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      setError(error.message);
      
      toast({
        title: 'Error',
        description: `Failed to complete onboarding: ${error.message}`,
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentStep,
    totalSteps,
    steps,
    stepFields,
    onboardingData,
    loading,
    progress,
    completed,
    error,
    setOnboardingData,
    moveToNextStep,
    moveToPreviousStep,
    submitCurrentStep,
    completeOnboarding,
  };
};

export default useOnboarding;
