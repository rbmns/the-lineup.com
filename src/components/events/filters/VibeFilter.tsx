
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VibeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const VIBES = [
  { value: 'all', label: 'All Vibes' },
  { value: 'chill', label: 'Chill' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'social', label: 'Social' },
  { value: 'creative', label: 'Creative' },
  { value: 'active', label: 'Active' },
  { value: 'foodie', label: 'Foodie' },
  { value: 'mindful', label: 'Mindful' },
  { value: 'nature', label: 'Nature' }
];

export const VibeFilter: React.FC<VibeFilterProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select vibe" />
      </SelectTrigger>
      <SelectContent>
        {VIBES.map((vibe) => (
          <SelectItem key={vibe.value} value={vibe.value}>
            {vibe.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
