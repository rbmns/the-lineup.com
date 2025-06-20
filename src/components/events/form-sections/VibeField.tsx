
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEventVibes } from '@/hooks/useEventVibes';

interface VibeFieldProps {
  control: Control<FormValues>;
}

export const VibeField: React.FC<VibeFieldProps> = ({ control }) => {
  const { vibes, isLoading } = useEventVibes();

  return (
    <div>
      <Label htmlFor="vibe">Event Vibe <span className="text-sm text-muted-foreground">(optional)</span></Label>
      <Controller
        name="vibe"
        control={control}
        render={({ field }) => (
          <Select 
            onValueChange={field.onChange} 
            value={field.value || undefined}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an event vibe" />
            </SelectTrigger>
            <SelectContent>
              {vibes.map((vibe) => (
                <SelectItem key={vibe} value={vibe}>
                  {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};
