
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'surf', label: 'Surf' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'music', label: 'Music' },
  { value: 'food', label: 'Food' },
  { value: 'hiking', label: 'Hiking' },
  { value: 'beach', label: 'Beach' },
  { value: 'art', label: 'Art' },
  { value: 'coffee', label: 'Coffee' }
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORIES.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
