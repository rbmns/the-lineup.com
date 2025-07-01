
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { EVENT_CATEGORIES } from '@/utils/categorySystem';
import { getCategoryIcon } from '@/components/ui/category/category-icon-mapping';
import { useFormContext } from 'react-hook-form';

export const CategoryToggleField: React.FC = () => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="eventCategory"
      render={({ field }) => (
        <FormItem className="form-group">
          <FormLabel htmlFor="event_category" className="form-label">Event Category *</FormLabel>
          <FormControl>
            <ToggleGroup 
              type="single" 
              value={field.value || ""} 
              onValueChange={(value) => {
                console.log("Category selection changed to:", value);
                field.onChange(value);
              }}
              className="flex flex-wrap gap-2 justify-start"
            >
              {EVENT_CATEGORIES.map((category) => {
                const Icon = getCategoryIcon(category);
                const isSelected = field.value === category;
                
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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
