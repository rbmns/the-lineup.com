
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TitleFieldProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const TitleField: React.FC<TitleFieldProps> = ({ register, errors }) => (
  <div className="space-y-2">
    <Label htmlFor="title" className="text-sm font-medium text-graphite-grey">
      Event Title *
    </Label>
    <Input
      id="title"
      type="text"
      placeholder="e.g., Beach Volleyball Tournament"
      className="h-10"
      {...register("title")}
      aria-invalid={errors.title ? "true" : "false"}
    />
    {errors.title && (
      <p className="text-sm text-red-500">{errors.title.message}</p>
    )}
  </div>
);
