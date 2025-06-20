
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MetaFieldsProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const MetaFields: React.FC<MetaFieldsProps> = ({ register, errors }) => (
  <>
    <div>
      <Label htmlFor="extra_info">Extra Info <span className="text-sm text-muted-foreground">(optional)</span></Label>
      <Textarea
        id="extra_info"
        placeholder="Any additional information about your event..."
        {...register("extra_info")}
        aria-invalid={errors.extra_info ? "true" : "false"}
      />
      {errors.extra_info && (
        <p className="text-red-500 text-sm mt-1">{errors.extra_info.message}</p>
      )}
    </div>

    <div>
      <Label htmlFor="tags">Tags <span className="text-sm text-muted-foreground">(optional)</span></Label>
      <Input
        id="tags"
        type="text"
        placeholder="e.g., beach, sunset, community (separate with commas)"
        {...register("tags")}
        aria-invalid={errors.tags ? "true" : "false"}
      />
      {errors.tags && (
        <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
      )}
    </div>
  </>
);
