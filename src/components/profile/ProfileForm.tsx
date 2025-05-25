
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { UserProfile } from '@/types';
import { profileFormSchema, ProfileFormData } from './ProfileFormSchema';
import { UsernameSection } from './form-sections/UsernameSection';
import { LocationSection } from './form-sections/LocationSection';
import { TaglineSection } from './form-sections/TaglineSection';

interface ProfileFormProps {
  profile: UserProfile | null;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
  showRequiredFields?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSubmit,
  onCancel,
  showRequiredFields = false
}) => {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profile?.username || '',
      location: profile?.location || '',
      tagline: profile?.tagline || '',
    },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    await onSubmit(data);
    // No toast message here - removed as requested
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <UsernameSection 
          form={form} 
          isRequired={showRequiredFields}
        />
        
        <LocationSection 
          form={form} 
          isRequired={showRequiredFields}
        />
        
        <TaglineSection form={form} />

        <div className="flex gap-4 pt-4">
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="flex-1 bg-black text-white hover:bg-gray-800"
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
