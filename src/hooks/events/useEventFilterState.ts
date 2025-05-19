
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export const useEventFilterState = () => {
  // Initialize with empty arrays instead of specific event types
  // This allows the parent component to populate with all event types if needed
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Consider having active filters based on venues, date range or date filter
  // For event types, only consider it an active filter if not all types are selected
  const hasActiveFilters =
    selectedEventTypes.length > 0 ||
    selectedVenues.length > 0 ||
    dateRange !== undefined ||
    selectedDateFilter !== '';

  const hasAdvancedFilters =
    selectedVenues.length > 0 ||
    dateRange !== undefined ||
    selectedDateFilter !== '';

  const resetFilters = () => {
    setSelectedEventTypes([]);
    setSelectedVenues([]);
    setDateRange(undefined);
    setSelectedDateFilter('');
  };

  const handleRemoveEventType = (type: string) => {
    setSelectedEventTypes((prev) => prev.filter((t) => t !== type));
  };

  const handleRemoveVenue = (venue: string) => {
    setSelectedVenues((prev) => prev.filter((v) => v !== venue));
  };

  const handleClearDateFilter = () => {
    setDateRange(undefined);
    setSelectedDateFilter('');
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(prev => !prev);
  };

  return {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    setIsFilterLoading,
    showAdvancedFilters,
    setShowAdvancedFilters,
    toggleAdvancedFilters,
    hasActiveFilters,
    hasAdvancedFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
  };
};
