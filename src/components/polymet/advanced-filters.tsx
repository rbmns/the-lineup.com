
import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  className?: string;
  locations?: string[];
  initialFilters?: Partial<FilterValues>;
  eventCategories?: string[];
}

export interface FilterValues {
  date: Date | undefined;
  location: string | undefined;
  eventTypes: string[];
  venues: string[];
  eventVibes: string[];
  dateFilter: string | undefined;
}

export default function AdvancedFilters({
  onFilterChange,
  className,
  locations = ["Zandvoort Area"],
  initialFilters = {},
  eventCategories = [],
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [venues, setVenues] = useState<Array<{id: string, name: string}>>([]);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [vibes, setVibes] = useState<Array<string>>([]);
  const [vibesLoading, setVibesLoading] = useState(true);
  
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

  // Fetch venues from the database
  useEffect(() => {
    const fetchVenues = async () => {
      setVenuesLoading(true);
      try {
        const { data: eventsWithVenues, error } = await supabase
          .from('events')
          .select(`
            venue_id,
            venues:venue_id(id, name)
          `)
          .not('venue_id', 'is', null)
          .not('venues', 'is', null);

        if (error) {
          console.error('Error fetching venues:', error);
          return;
        }

        const uniqueVenues = new Map<string, {id: string, name: string}>();
        eventsWithVenues?.forEach(event => {
          if (event.venues && event.venue_id) {
            const venueData = Array.isArray(event.venues) ? event.venues[0] : event.venues;
            if (venueData && venueData.name) {
              uniqueVenues.set(event.venue_id, {
                id: event.venue_id,
                name: venueData.name
              });
            }
          }
        });

        const venuesList = Array.from(uniqueVenues.values())
          .filter(venue => venue.name)
          .sort((a, b) => a.name.localeCompare(b.name));

        console.log('Loaded venues for filtering:', venuesList);
        setVenues(venuesList);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setVenuesLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Fetch vibes from the events table
  useEffect(() => {
    const fetchVibes = async () => {
      setVibesLoading(true);
      try {
        const { data: eventsData, error } = await supabase
          .from('events')
          .select('vibe')
          .not('vibe', 'is', null)
          .not('vibe', 'eq', '');

        if (error) {
          console.error('Error fetching vibes:', error);
          return;
        }

        // Get unique vibes and filter out empty/null values
        const uniqueVibes = Array.from(new Set(
          eventsData?.map(event => event.vibe).filter(Boolean)
        )).sort();

        console.log('Loaded vibes for filtering:', uniqueVibes);
        setVibes(uniqueVibes);
      } catch (error) {
        console.error('Error fetching vibes:', error);
      } finally {
        setVibesLoading(false);
      }
    };

    fetchVibes();
  }, []);

  const handleDateChange = (date: Date | undefined) => {
    const newFilters = { ...filters, date, dateFilter: undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const handleDateFilterChange = (dateFilter: string) => {
    const newFilters = { ...filters, dateFilter, date: undefined };
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

  const handleVenueChange = (venueId: string, checked: boolean) => {
    const newVenues = checked 
      ? [...filters.venues, venueId]
      : filters.venues.filter(v => v !== venueId);
    const newFilters = { ...filters, venues: newVenues };
    setFilters(newFilters);
    onFilterChange(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const handleVibeChange = (vibe: string, checked: boolean) => {
    const newVibes = checked 
      ? [...filters.eventVibes, vibe]
      : filters.eventVibes.filter(v => v !== vibe);
    const newFilters = { ...filters, eventVibes: newVibes };
    setFilters(newFilters);
    onFilterChange(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const updateActiveFiltersCount = (newFilters: FilterValues) => {
    let count = 0;
    if (newFilters.date) count++;
    if (newFilters.dateFilter) count++;
    if (newFilters.location && newFilters.location !== "Zandvoort Area") count++;
    if (newFilters.venues.length > 0) count++;
    if (newFilters.eventVibes.length > 0) count++;
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

  const dateFilterOptions = [
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this-weekend', label: 'This Weekend' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'this-month', label: 'This Month' },
  ];

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
        <PopoverContent className="w-auto p-4 z-50 bg-white" align="start">
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

            {/* Desktop: Horizontal layout */}
            <div className="hidden md:flex md:gap-6">
              {/* Date Filter Options */}
              <div className="space-y-2 min-w-[200px]">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon size={16} />
                  Quick Date Filters
                </label>
                <Select
                  value={filters.dateFilter || ""}
                  onValueChange={handleDateFilterChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white">
                    {dateFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Venues */}
              <div className="space-y-2 min-w-[200px]">
                <label className="text-sm font-medium flex items-center gap-2">
                  <BuildingIcon size={16} />
                  Venues
                </label>
                {venuesLoading ? (
                  <div className="text-sm text-gray-500">Loading venues...</div>
                ) : venues.length === 0 ? (
                  <div className="text-sm text-gray-500">No venues found</div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {venues.map((venue) => (
                      <div key={venue.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={venue.id}
                          checked={filters.venues.includes(venue.id)}
                          onCheckedChange={(checked) => 
                            handleVenueChange(venue.id, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={venue.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {venue.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vibes */}
              <div className="space-y-2 min-w-[200px]">
                <label className="text-sm font-medium flex items-center gap-2">
                  <BuildingIcon size={16} />
                  Vibes
                </label>
                {vibesLoading ? (
                  <div className="text-sm text-gray-500">Loading vibes...</div>
                ) : vibes.length === 0 ? (
                  <div className="text-sm text-gray-500">No vibes found</div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {vibes.map((vibe) => (
                      <div key={vibe} className="flex items-center space-x-2">
                        <Checkbox
                          id={vibe}
                          checked={filters.eventVibes.includes(vibe)}
                          onCheckedChange={(checked) => 
                            handleVibeChange(vibe, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={vibe}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {vibe}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2 min-w-[150px]">
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
                  <SelectContent className="z-50 bg-white">
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile: Vertical layout */}
            <div className="md:hidden space-y-4">
              {/* Date Filter Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon size={16} />
                  Quick Date Filters
                </label>
                <Select
                  value={filters.dateFilter || ""}
                  onValueChange={handleDateFilterChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white">
                    {dateFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Specific Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon size={16} />
                  Specific Date
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

              {/* Venues */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <BuildingIcon size={16} />
                  Venues
                </label>
                {venuesLoading ? (
                  <div className="text-sm text-gray-500">Loading venues...</div>
                ) : venues.length === 0 ? (
                  <div className="text-sm text-gray-500">No venues found</div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {venues.map((venue) => (
                      <div key={venue.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={venue.id}
                          checked={filters.venues.includes(venue.id)}
                          onCheckedChange={(checked) => 
                            handleVenueChange(venue.id, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={venue.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {venue.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vibes */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <BuildingIcon size={16} />
                  Vibes
                </label>
                {vibesLoading ? (
                  <div className="text-sm text-gray-500">Loading vibes...</div>
                ) : vibes.length === 0 ? (
                  <div className="text-sm text-gray-500">No vibes found</div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {vibes.map((vibe) => (
                      <div key={vibe} className="flex items-center space-x-2">
                        <Checkbox
                          id={vibe}
                          checked={filters.eventVibes.includes(vibe)}
                          onCheckedChange={(checked) => 
                            handleVibeChange(vibe, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={vibe}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {vibe}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
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
                  <SelectContent className="z-50 bg-white">
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
      {filters.dateFilter && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-primary-50 bg-primary-10 text-primary"
          onClick={() => handleDateFilterChange("")}
        >
          <CalendarIcon size={16} />
          <span>{dateFilterOptions.find(opt => opt.value === filters.dateFilter)?.label}</span>
          <XIcon size={14} />
        </Button>
      )}

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
          <BuildingIcon size={16} />
          <span>{filters.eventVibes.length} vibes</span>
          <XIcon size={14} />
        </Button>
      )}
    </div>
  );
}
