
import React from 'react';
import { UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useEventVibes } from '@/hooks/useEventVibes';
import { Skeleton } from '@/components/ui/skeleton';
import { getVibeColorClasses } from '@/utils/vibeColors';

interface VibeToggleFieldProps {
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const VibeToggleField: React.FC<VibeToggleFieldProps> = ({ 
  watch, 
  setValue, 
  errors 
}) => {
  const { data: vibes, isLoading, isError, error } = useEventVibes();
  const selectedVibe = watch("vibe");

  const handleVibeChange = (value: string) => {
    setValue("vibe", value || null, { shouldValidate: true, shouldDirty: true });
  };

  if (isLoading) {
    return (
      <div>
        <Label htmlFor="vibe">Event Vibe (Optional)</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    console.error('VibeToggleField error:', error);
    return (
      <div>
        <Label htmlFor="vibe">Event Vibe (Optional)</Label>
        <div className="text-sm text-destructive p-2 bg-destructive/10 border border-destructive/20 rounded-md mt-2">
          <p className="font-semibold">Error loading vibes</p>
          <p>{error?.message || 'Failed to load vibe options'}</p>
        </div>
      </div>
    );
  }

  // Ensure we have vibes to display
  const vibeOptions = vibes && vibes.length > 0 ? vibes : ['party', 'chill', 'wellness', 'active', 'social', 'creative'];

  return (
    <div>
      <Label htmlFor="vibe">Event Vibe (Optional)</Label>
      <ToggleGroup 
        type="single" 
        value={selectedVibe || ""} 
        onValueChange={handleVibeChange}
        className="flex flex-wrap gap-2 mt-2"
      >
        {vibeOptions.map((vibe) => (
          <ToggleGroupItem
            key={vibe}
            value={vibe}
            variant="outline"
            className={`capitalize text-sm transition-all duration-200 ${
              selectedVibe === vibe 
                ? getVibeColorClasses(vibe, true, 'md').replace('rounded-full', 'rounded-full border-0')
                : 'px-3 py-2 rounded-full border hover:bg-gray-50'
            }`}
          >
            {vibe}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {errors.vibe && (
        <p className="text-red-500 text-sm mt-1">{errors.vibe.message}</p>
      )}
    </div>
  );
};
