
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
    console.log("Category selection changed to:", value);
    if (value && value !== selectedCategory) {
      setValue("event_category", value, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="event_category" className="form-label">Event Category</Label>
      <ToggleGroup 
        type="single" 
        value={selectedCategory || ""} 
        onValueChange={handleCategoryChange}
        className="flex flex-wrap gap-2 justify-start"
      >
        {EVENT_CATEGORIES.map((category) => {
          const Icon = getCategoryIcon(category);
          const isSelected = selectedCategory === category;
          
          return (
            <ToggleGroupItem
              key={category}
              value={category}
              variant="outline"
              className={`
                capitalize text-sm px-3 py-2 rounded-md border transition-all duration-200
                ${isSelected 
                  ? 'bg-ocean-teal text-pure-white border-ocean-teal shadow-sm' 
                  : 'bg-pure-white text-graphite-grey border-mist-grey hover:bg-coastal-haze hover:border-ocean-teal'
                }
              `}
              data-state={isSelected ? 'on' : 'off'}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {category}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
      {errors.event_category && (
        <p className="form-error-message">{errors.event_category.message}</p>
      )}
    </div>
  );
};
