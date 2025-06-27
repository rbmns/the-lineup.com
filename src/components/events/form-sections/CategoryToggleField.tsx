
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
        className="flex flex-wrap gap-1.5 mt-2"
      >
        {EVENT_CATEGORIES.map((category) => {
          const Icon = getCategoryIcon(category);
          return (
            <ToggleGroupItem
              key={category}
              value={category}
              variant="outline"
              className="capitalize text-xs px-2 py-1.5 rounded-sm border border-sage bg-coconut text-midnight hover:bg-seafoam hover:border-overcast data-[state=on]:bg-seafoam data-[state=on]:text-midnight data-[state=on]:border-overcast transition-colors font-mono"
            >
              {Icon && <Icon className="mr-1.5 h-3 w-3" />}
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
