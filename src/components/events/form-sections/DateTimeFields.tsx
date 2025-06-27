
import React from 'react';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';

interface DateTimeFieldsProps {
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({ register, watch, setValue, errors }) => (
  <div className="space-y-3 sm:space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="start_date" className="text-sm sm:text-base">Start Date</Label>
        <DatePicker
          selected={watch("start_date")}
          onSelect={(date) => date && setValue("start_date", date)}
          className="w-full h-8 sm:h-10 text-sm"
        />
        {errors.start_date && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.start_date.message}</p>
        )}
      </div>

      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="start_time" className="text-sm sm:text-base">Start Time</Label>
        <Input
          id="start_time"
          type="time"
          {...register("start_time")}
          aria-invalid={errors.start_time ? "true" : "false"}
          className="h-8 sm:h-10 text-sm"
        />
        {errors.start_time && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.start_time.message}</p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="end_date" className="text-sm sm:text-base">End Date</Label>
        <DatePicker
          selected={watch("end_date")}
          onSelect={(date) => date && setValue("end_date", date)}
          className="w-full h-8 sm:h-10 text-sm"
        />
        {errors.end_date && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.end_date.message}</p>
        )}
      </div>

      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="end_time" className="text-sm sm:text-base">End Time</Label>
        <Input
          id="end_time"
          type="time"
          {...register("end_time")}
          aria-invalid={errors.end_time ? "true" : "false"}
          className="h-8 sm:h-10 text-sm"
        />
        {errors.end_time && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.end_time.message}</p>
        )}
      </div>
    </div>
  </div>
);
