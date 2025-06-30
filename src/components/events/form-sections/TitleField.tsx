
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
  <div className="form-group">
    <Label htmlFor="title" className="form-label">
      Event Title *
    </Label>
    <Input
      id="title"
      type="text"
      placeholder="e.g., Beach Volleyball Tournament"
      className="form-field input-field-large"
      {...register("title")}
      aria-invalid={errors.title ? "true" : "false"}
    />
    {errors.title && (
      <p className="form-error-message">{errors.title.message}</p>
    )}
  </div>
);
