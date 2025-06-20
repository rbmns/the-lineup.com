
import React from 'react';
import { UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { VibeField } from './VibeField';

interface OptionalDetailsFieldsProps {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const OptionalDetailsFields: React.FC<OptionalDetailsFieldsProps> = ({ register, control, errors }) => (
  <div className="space-y-6">
    {/* Organizer Link */}
    <div>
      <Label htmlFor="organizer_link">
        Organizer Link 
        <span className="text-sm text-muted-foreground ml-1">(optional)</span>
      </Label>
      <Input
        id="organizer_link"
        type="url"
        placeholder="organizer.com (http:// will be added automatically)"
        {...register("organizer_link")}
        aria-invalid={errors.organizer_link ? "true" : "false"}
      />
      {errors.organizer_link && (
        <p className="text-red-500 text-sm mt-1">{errors.organizer_link.message}</p>
      )}
      <p className="text-xs text-gray-500 mt-1">
        You can enter just the domain name - we'll add http:// automatically if needed
      </p>
    </div>

    {/* Fee */}
    <div>
      <Label htmlFor="fee">
        Fee 
        <span className="text-sm text-muted-foreground ml-1">(optional)</span>
      </Label>
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

    {/* Booking Link */}
    <div>
      <Label htmlFor="booking_link">
        Booking Link 
        <span className="text-sm text-muted-foreground ml-1">(optional)</span>
      </Label>
      <Input
        id="booking_link"
        type="url"
        placeholder="booking.com (http:// will be added automatically)"
        {...register("booking_link")}
        aria-invalid={errors.booking_link ? "true" : "false"}
      />
      {errors.booking_link && (
        <p className="text-red-500 text-sm mt-1">{errors.booking_link.message}</p>
      )}
      <p className="text-xs text-gray-500 mt-1">
        You can enter just the domain name - we'll add http:// automatically if needed
      </p>
    </div>

    {/* Event Vibe */}
    <VibeField control={control} />

    {/* Extra Info */}
    <div>
      <Label htmlFor="extra_info">
        Extra Info 
        <span className="text-sm text-muted-foreground ml-1">(optional)</span>
      </Label>
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

    {/* Tags */}
    <div>
      <Label htmlFor="tags">
        Tags 
        <span className="text-sm text-muted-foreground ml-1">(optional)</span>
      </Label>
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
  </div>
);
