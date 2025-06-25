
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateCasualPlanForm } from '@/components/casual-plans/CreateCasualPlanForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCasualPlans } from '@/hooks/useCasualPlans';
import { CreateCasualPlanData } from '@/types/casual-plans';
import { useToast } from '@/hooks/use-toast';

export default function CreateCasualPlanPage() {
  const navigate = useNavigate();
  const { createPlan, isCreating } = useCasualPlans();
  const { toast } = useToast();

  const handleSubmit = async (data: CreateCasualPlanData) => {
    try {
      console.log('Submitting casual plan:', data);
      await createPlan(data);
      
      toast({
        title: "Plan created!",
        description: "Your casual plan has been created successfully.",
      });
      
      navigate('/casual-plans');
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Error",
        description: "Failed to create your plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/casual-plans')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Casual Plans
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create a Casual Plan</h1>
        <p className="text-muted-foreground">
          Organize a spontaneous meetup or activity with fellow travelers and locals.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <CreateCasualPlanForm 
          onSubmit={handleSubmit}
          onCancel={() => navigate('/casual-plans')}
          isCreating={isCreating}
        />
      </div>
    </div>
  );
}
