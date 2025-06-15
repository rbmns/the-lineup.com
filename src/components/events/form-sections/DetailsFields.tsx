
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DetailsFieldsProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const DetailsFields: React.FC<DetailsFieldsProps> = ({ register, errors }) => (
  <>
    <div>
      <Label htmlFor="organizer_link">Organizer Link</Label>
      <Input
        id="organizer_link"
        type="url"
        placeholder="https://organizer.com"
        {...register("organizer_link")}
        aria-invalid={errors.organizer_link ? "true" : "false"}
      />
      {errors.organizer_link && (
        <p className="text-red-500 text-sm mt-1">{errors.organizer_link.message}</p>
      )}
    </div>

    <div>
      <Label htmlFor="fee">Fee</Label>
      <Input
        id="fee"
        type="number"
        placeholder="0.00"
        {...register("fee")}
        aria-invalid={errors.fee ? "true" : "false"}
      />
      {errors.fee && (
        <p className="text-red-500 text-sm mt-1">{errors.fee.message}</p>
      )}
    </div>

    <div>
      <Label htmlFor="booking_link">Booking Link</Label>
      <Input
        id="booking_link"
        type="url"
        placeholder="https://booking.com"
        {...register("booking_link")}
        aria-invalid={errors.booking_link ? "true" : "false"}
      />
      {errors.booking_link && (
        <p className="text-red-500 text-sm mt-1">{errors.booking_link.message}</p>
      )}
    </div>
  </>
);
