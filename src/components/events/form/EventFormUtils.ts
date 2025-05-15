
import { format, isValid } from 'date-fns';
import { SafeEventData } from './EventFormTypes';

/**
 * Helper function to combine date and time into a single Date object
 */
export const combineDateTime = (date: Date, timeString: string): Date | null => {
  try {
    if (!date || !timeString) return null;
    
    const [hours, minutes] = timeString.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) return null;
    
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    
    return isValid(combined) ? combined : null;
  } catch (error) {
    console.error('Error combining date and time:', error);
    return null;
  }
};

/**
 * Process form data into a format suitable for API submission
 */
export const processFormData = (data: any, userId: string): SafeEventData => {
  // Parse date and time strings into ISO format
  const startDateTime = combineDateTime(data.start_date, data.start_time);
  const endDateTime = combineDateTime(data.end_date, data.end_time);
  
  if (!startDateTime || !endDateTime) {
    throw new Error('Invalid date or time format');
  }
  
  // Process tags - split by commas and trim whitespace
  const tagsArray = data.tags
    .split(',')
    .map((tag: string) => tag.trim())
    .filter((tag: string) => tag.length > 0);
  
  // Format date for slug - YYYY-MM-DD
  const formattedDate = format(startDateTime, 'yyyy-MM-dd');
  
  // Create slug from date and title - note that the database has a trigger that
  // will create the slug, but we include this for completeness
  const titleSlug = data.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')     // Replace spaces with dashes
    .replace(/-+/g, '-');     // Replace multiple dashes with single dash
  
  const slug = `${formattedDate}-${titleSlug}`;
  
  // Create the event data object
  return {
    title: data.title,
    description: data.description,
    event_type: data.event_type,
    start_time: startDateTime.toISOString(),
    end_time: endDateTime.toISOString(),
    venue_id: data.venue_id || null,
    organizer_link: data.organizer_link,
    fee: parseFloat(data.fee) || 0, // Convert string to number
    booking_link: data.booking_link,
    extra_info: data.extra_info,
    tags: tagsArray,
    created_by: userId,
    slug: slug // Include the generated slug
  };
};

/**
 * Safely extract values from event data with proper type handling
 */
export const extractEventValues = (event: any): SafeEventData => {
  if (!event) return {};
  
  try {
    return {
      id: event.id,
      title: event.title || '',
      description: event.description || '',
      event_type: event.event_type || 'other',
      start_time: event.start_time,
      end_time: event.end_time,
      venue_id: event.venue_id || '',
      organizer_link: event.organizer_link || '',
      fee: typeof event.fee === 'string' ? parseFloat(event.fee) : (event.fee || 0), // Ensure fee is a number
      booking_link: event.booking_link || '',
      extra_info: event.extra_info || event['Extra info'] || '',
      tags: Array.isArray(event.tags) ? event.tags : (typeof event.tags === 'string' ? event.tags.split(',') : []),
      slug: event.slug
    };
  } catch (error) {
    console.error('Error extracting event values:', error);
    return {};
  }
};
