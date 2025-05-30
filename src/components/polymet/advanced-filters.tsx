
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/polymet/button";
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
  TagIcon,
  BuildingIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  className?: string;
  locations?: string[];
  initialFilters?: Partial<FilterValues>;
  eventCategories?: string[]; // Add this prop to receive actual categories
}

export interface FilterValues {
  date: Date | undefined;
  location: string | undefined;
  eventTypes: string[];
  venues: string[];
  eventVibes: string[];
  dateFilter: string | undefined;
}

const venues = [
  "Beach Club", "Yoga Studio", "Concert Hall", "Restaurant", 
  "Art Gallery", "Sports Center", "Festival Ground"
];

export default function AdvancedFilters({
  onFilterChange,
  className,
  locations = ["Zandvoort Area"],
  initialFilters = {},
  eventCategories = [], // Default to empty array
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    date: initialFilters.date,
    location: initialFilters.location || "Zandvoort Area",
    eventTypes: initialFilters.eventTypes || [],
    venues: initialFilters.venues || [],
    eventVibes: initialFilters.eventVibes || [],
    dateFilter: initialFilters.dateFilter,
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

  const handleEventTypeChange = (eventType: string, checked: boolean) => {
    const newEventTypes = checked 
      ? [...filters.eventTypes, eventType]
      : filters.eventTypes.filter(type => type !== eventType);
    const newFilters = { ...filters, eventTypes: newEventTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const handleVenueChange = (venue: string, checked: boolean) => {
    const newVenues = checked 
      ? [...filters.venues, venue]
      : filters.venues.filter(v => v !== venue);
    const newFilters = { ...filters, venues: newVenues };
    setFilters(newFilters);
    onFilterChange(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const updateActiveFiltersCount = (newFilters: FilterValues) => {
    let count = 0;
    if (newFilters.date) count++;
    if (newFilters.location && newFilters.location !== "Zandvoort Area") count++;
    if (newFilters.eventTypes.length > 0) count++;
    if (newFilters.venues.length > 0) count++;
    if (newFilters.eventVibes.length > 0) count++;
    if (newFilters.dateFilter) count++;
    setActiveFiltersCount(count);
  };

  const clearFilters = () => {
    const newFilters = {
      date: undefined,
      location: "Zandvoort Area",
      eventTypes: [],
      venues: [],
      eventVibes: [],
      dateFilter: undefined,
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
        <PopoverContent className="w-96 p-4" align="start">
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

            {/* Event Categories - use actual categories from props */}
            {eventCategories.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <TagIcon size={16} />
                  Event Categories
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {eventCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={filters.eventTypes.includes(category)}
                        onCheckedChange={(checked) => 
                          handleEventTypeChange(category, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={category}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Venues */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <BuildingIcon size={16} />
                Venues
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {venues.map((venue) => (
                  <div key={venue} className="flex items-center space-x-2">
                    <Checkbox
                      id={venue}
                      checked={filters.venues.includes(venue)}
                      onCheckedChange={(checked) => 
                        handleVenueChange(venue, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={venue}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {venue}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon size={16} />
                Date
              </label>
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

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPinIcon size={16} />
                Location
              </label>
              <Select
                value={filters.location || "Zandvoort Area"}
                onValueChange={handleLocationChange}
                disabled
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

      {/* Active Filter Pills */}
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

      {filters.eventTypes.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-primary-50 bg-primary-10 text-primary"
          onClick={() => {
            const newFilters = { ...filters, eventTypes: [] };
            setFilters(newFilters);
            onFilterChange(newFilters);
            updateActiveFiltersCount(newFilters);
          }}
        >
          <TagIcon size={16} />
          <span>{filters.eventTypes.length} categories</span>
          <XIcon size={14} />
        </Button>
      )}

      {filters.venues.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-primary-50 bg-primary-10 text-primary"
          onClick={() => {
            const newFilters = { ...filters, venues: [] };
            setFilters(newFilters);
            onFilterChange(newFilters);
            updateActiveFiltersCount(newFilters);
          }}
        >
          <BuildingIcon size={16} />
          <span>{filters.venues.length} venues</span>
          <XIcon size={14} />
        </Button>
      )}

      {filters.eventVibes.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-primary-50 bg-primary-10 text-primary"
          onClick={() => {
            const newFilters = { ...filters, eventVibes: [] };
            setFilters(newFilters);
            onFilterChange(newFilters);
            updateActiveFiltersCount(newFilters);
          }}
        >
          <TagIcon size={16} />
          <span>{filters.eventVibes.length} vibes</span>
          <XIcon size={14} />
        </Button>
      )}
    </div>
  );
}
