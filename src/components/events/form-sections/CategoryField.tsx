
import React from 'react';
import { FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormValues, EVENT_CATEGORIES } from '@/components/events/form/EventFormTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CategoryFieldProps {
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const CategoryField: React.FC<CategoryFieldProps> = ({ watch, setValue, errors }) => (
  <div>
    <Label htmlFor="event_category">Event Category</Label>
    <Select
      value={watch("event_category")}
      onValueChange={(value) => setValue("event_category", value as any)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select event category" />
      </SelectTrigger>
      <SelectContent>
        {EVENT_CATEGORIES.map(category => (
          <SelectItem key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {errors.event_category && (
      <p className="text-red-500 text-sm mt-1">{errors.event_category.message}</p>
    )}
  </div>
);
