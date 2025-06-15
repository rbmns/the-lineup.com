
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
  <div>
    <Label htmlFor="title">Title</Label>
    <Input
      id="title"
      type="text"
      placeholder="Event title"
      {...register("title")}
      aria-invalid={errors.title ? "true" : "false"}
    />
    {errors.title && (
      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
    )}
  </div>
);
