
import React from 'react';
import { UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { EVENT_CATEGORIES } from '@/utils/categorySystem';
import { getCategoryIcon } from '@/components/ui/category/category-icon-mapping';

interface CategoryToggleFieldProps {
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const CategoryToggleField: React.FC<CategoryToggleFieldProps> = ({ 
  watch, 
  setValue, 
  errors 
}) => {
  const selectedCategory = watch("event_category");

  const handleCategoryChange = (value: string) => {
    if (value) {
      setValue("event_category", value, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <div>
      <Label htmlFor="event_category">Event Category</Label>
      <ToggleGroup 
        type="single" 
        value={selectedCategory} 
        onValueChange={handleCategoryChange}
        className="flex flex-wrap gap-2 mt-2"
      >
        {EVENT_CATEGORIES.map((category) => {
          const Icon = getCategoryIcon(category);
          return (
            <ToggleGroupItem
              key={category}
              value={category}
              variant="outline"
              className="capitalize text-sm px-3 py-2 rounded-full data-[state=on]:bg-seafoam data-[state=on]:text-midnight"
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {category}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
      {errors.event_category && (
        <p className="text-red-500 text-sm mt-1">{errors.event_category.message}</p>
      )}
    </div>
  );
};
