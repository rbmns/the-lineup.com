
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface DescriptionFieldProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({ register, errors }) => (
  <div>
    <Label htmlFor="description">Description</Label>
    <Textarea
      id="description"
      placeholder="Event description"
      {...register("description")}
      aria-invalid={errors.description ? "true" : "false"}
    />
    {errors.description && (
      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
    )}
  </div>
);
