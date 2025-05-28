
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateCasualPlanForm } from '@/components/casual-plans/CreateCasualPlanForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CreateCasualPlanPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/casual-plans');
  };

  const handleCancel = () => {
    navigate('/casual-plans');
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
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
