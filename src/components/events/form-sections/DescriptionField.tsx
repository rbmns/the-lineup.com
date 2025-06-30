
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
  <div className="space-y-3">
    <Label htmlFor="description" className="form-label">
      Description *
    </Label>
    <Textarea
      id="description"
      placeholder="Tell people what your event is about, what to expect, what to bring..."
      className="textarea-field min-h-[120px]"
      {...register("description")}
      aria-invalid={errors.description ? "true" : "false"}
    />
    {errors.description && (
      <p className="text-red-500 text-small mt-2">{errors.description.message}</p>
    )}
  </div>
);
