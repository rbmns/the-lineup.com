
import { EventFormData } from './EventFormSchema';
import { fromZonedTime } from 'date-fns-tz';

export const processFormData = async (data: EventFormData, userId: string | null) => {
  console.log('🔄 Processing form data for user:', userId);
  console.log('📋 Raw form data:', data);
  console.log('📅 Start date:', data.startDate, 'Start time:', data.startTime);
  console.log('📍 Location data:', { venueName: data.venueName, address: data.address, city: data.city, postalCode: data.postalCode });
  console.log('🌍 Event timezone:', data.timezone);
  
  // Convert date and time to datetime in the event's timezone
  const startDateTime = data.startDate && data.startTime 
    ? (() => {
        const eventTimezone = data.timezone || 'Europe/Amsterdam';
        
        // Create a date string that represents the local time in the event's timezone
        const year = data.startDate.getFullYear();
        const month = String(data.startDate.getMonth() + 1).padStart(2, '0');
        const day = String(data.startDate.getDate()).padStart(2, '0');
        
        // Combine date and time as if it's in the target timezone
        const localDateTimeString = `${year}-${month}-${day}T${data.startTime}:00`;
        
        // Parse as a local date first
        const localDate = new Date(localDateTimeString);
        
        // Convert from the event's timezone to UTC
        const utcDateTime = fromZonedTime(localDate, eventTimezone);
        
        console.log('⏰ Start time conversion:', {
          input: `${data.startTime} local time in ${eventTimezone}`,
          localDateTimeString,
          utcResult: utcDateTime.toISOString()
        });
        
        return utcDateTime;
      })()
    : null;
    
  const endDateTime = data.endDate && data.endTime 
    ? (() => {
        const eventTimezone = data.timezone || 'Europe/Amsterdam';
        
        const year = data.endDate.getFullYear();
        const month = String(data.endDate.getMonth() + 1).padStart(2, '0');
        const day = String(data.endDate.getDate()).padStart(2, '0');
        
        const localDateTimeString = `${year}-${month}-${day}T${data.endTime}:00`;
        const localDate = new Date(localDateTimeString);
        
        // Convert from the event's timezone to UTC
        return fromZonedTime(localDate, eventTimezone);
      })()
    : null;

  // Process tags
  const tagsArray = data.tags || [];
  const tagsString = tagsArray.length > 0 ? tagsArray.join(', ') : null;

  // Generate Google Maps link if not provided
  const googleMapsLink = data.googleMaps || (() => {
    if (data.address && data.city) {
      const searchQuery = encodeURIComponent(`${data.address}, ${data.city}`);
      return `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    } else if (data.venueName && data.city) {
      const searchQuery = encodeURIComponent(`${data.venueName}, ${data.city}`);
      return `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    } else if (data.city) {
      const searchQuery = encodeURIComponent(data.city);
      return `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    }
    return null;
  })();

  const processedData = {
    title: data.title,
    description: data.description || null,
    event_category: data.eventCategory || null,
    start_datetime: startDateTime?.toISOString(),
    end_datetime: endDateTime?.toISOString(),
    destination: data.city || null,
    venue_name: data.venueName || null,
    address: data.address || null,
    postal_code: data.postalCode || null,
    booking_link: data.bookingLink || null,
    google_maps: googleMapsLink,
    fee: data.fee || null,
    extra_info: null, // Remove the reference to data.extraInfo since it doesn't exist in the schema
    tags: tagsString,
    vibe: data.vibe || null,
    creator: userId, // Will be null for unauthenticated users, filled in after auth
    timezone: data.timezone || 'Europe/Amsterdam',
    image_urls: data.imageUrl ? `["${data.imageUrl}"]` : null,
    status: 'published' as const
  };

  console.log('Processed event data:', processedData);
  
  // Validate required fields
  if (!processedData.title) {
    throw new Error('Event title is required');
  }
  
  if (!processedData.start_datetime) {
    throw new Error('Event start date and time are required');
  }
  
  return processedData;
};
