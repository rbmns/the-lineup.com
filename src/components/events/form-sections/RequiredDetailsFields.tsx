
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';

interface RequiredDetailsFieldsProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const RequiredDetailsFields: React.FC<RequiredDetailsFieldsProps> = ({ register, errors }) => {
  // Currently no required detail fields beyond the main ones
  // This component is ready for future required fields
  return null;
};
