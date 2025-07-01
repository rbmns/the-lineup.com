
// This file is now a barrel file that re-exports all date-related utilities
// for backward compatibility

// Re-export everything from the new modules
export * from './timezone-utils';
export * from './date-filtering';
// Export specific functions from event-date-utils to avoid conflicts
export { 
  getWeekRange, 
  getEventDateTime, 
  getEventEndDateTime, 
  combineDateAndTime, 
  getMultiDayDateRange, 
  isDateInEventRange 
} from './event-date-utils';

// Add the missing functions that CasualPlanPreviewCard needs
export function formatFeaturedDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting featured date:', error);
    return dateString;
  }
}

export function formatTime(timeString: string): string {
  try {
    // If it's already in HH:MM format, return as is
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }
    
    // If it's a full datetime string, extract time
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
}
