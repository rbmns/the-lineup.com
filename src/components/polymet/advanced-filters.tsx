import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/polymet/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  MapPinIcon,
  FilterIcon,
  XIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  className?: string;
  locations?: string[];
  initialFilters?: Partial<FilterValues>;
}

export interface FilterValues {
  date: Date | undefined;
  location: string | undefined;
}

export default function AdvancedFilters({
  onFilterChange,
  className,
  locations = [
    "All locations",
    "Zandvoort",
    "Haarlem",
    "Amsterdam",
    "Bloemendaal",
  ],

  initialFilters = {},
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    date: initialFilters.date,
    location: initialFilters.location || "All locations",
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(
    Object.values(initialFilters).filter(Boolean).length
  );

  const handleDateChange = (date: Date | undefined) => {
    const newFilters = { ...filters, date };
    setFilters(newFilters);
    onFilterChange(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const handleLocationChange = (location: string) => {
    const locationValue = location === "All locations" ? undefined : location;
    const newFilters = { ...filters, location: locationValue };
    setFilters(newFilters);
    onFilterChange(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const updateActiveFiltersCount = (newFilters: FilterValues) => {
    const count = Object.values(newFilters).filter(
      (value) => value !== undefined && value !== "All locations"
    ).length;
    setActiveFiltersCount(count);
  };

  const clearFilters = () => {
    const newFilters = {
      date: undefined,
      location: undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setActiveFiltersCount(0);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-2",
              activeFiltersCount > 0 &&
                "border-primary bg-primary-10 text-primary"
            )}
          >
            <FilterIcon size={16} />

            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Filters</h3>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-sm text-primary-75"
                  onClick={clearFilters}
                >
                  <XIcon size={14} className="mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <div className="rounded-md border">
                <Calendar
                  mode="single"
                  selected={filters.date}
                  onSelect={handleDateChange}
                  className="rounded-md border-0"
                  initialFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select
                value={filters.location || "All locations"}
                onValueChange={handleLocationChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={() => setIsOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {filters.date && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-primary-50 bg-primary-10 text-primary"
          onClick={() => handleDateChange(undefined)}
        >
          <CalendarIcon size={16} />

          <span>
            {filters.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <XIcon size={14} />
        </Button>
      )}

      {filters.location && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-primary-50 bg-primary-10 text-primary"
          onClick={() => handleLocationChange("All locations")}
        >
          <MapPinIcon size={16} />

          <span>{filters.location}</span>
          <XIcon size={14} />
        </Button>
      )}
    </div>
  );
}
