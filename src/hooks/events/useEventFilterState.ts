
import { useGlobalFilterState } from './useGlobalFilterState';

export const useEventFilterState = () => {
  const {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    selectedVibes,
    setSelectedVibes,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleRemoveVibe,
    handleClearDateFilter,
    hasActiveFilters,
    hasAdvancedFilters,
    isFilterLoading,
  } = useGlobalFilterState();

  // Additional state for UI
  const showAdvancedFilters = false; // Can be expanded later
  const toggleAdvancedFilters = () => {}; // Can be expanded later

  return {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    selectedVibes,
    setSelectedVibes,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    showAdvancedFilters,
    toggleAdvancedFilters,
    hasActiveFilters,
    hasAdvancedFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleRemoveVibe,
    handleClearDateFilter
  };
};
