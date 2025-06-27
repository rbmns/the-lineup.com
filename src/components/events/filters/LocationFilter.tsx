
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVenueAreas } from '@/hooks/useVenueAreas';
import { Skeleton } from '@/components/ui/skeleton';

interface LocationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({ value, onChange }) => {
  const { data: areas, isLoading } = useVenueAreas();

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  // Set default to "all" if no value is provided
  const currentValue = value || "all";

  return (
    <Select value={currentValue} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="All Areas" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Areas</SelectItem>
        {areas?.map((area) => (
          <SelectItem key={area.id} value={area.id}>
            {area.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
