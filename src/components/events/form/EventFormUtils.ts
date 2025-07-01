
import { EventFormData } from './EventFormSchema';
import TimezoneService from '@/services/timezoneService';
import LocationService from '@/services/locationService';

export const processFormData = async (data: EventFormData, userId: string) => {
  // Process tags - convert string to array
  const processedTags = data.tags 
    ? data.tags.join(', ')
    : '';

  // Build location string from components
  const locationParts = [
    data.venueName,
    data.address,
    data.city,
    data.postalCode
  ].filter(Boolean);
  
  const location = locationParts.join(', ');

  // Convert dates to ISO strings and combine with times
  const startDate = data.startDate ? data.startDate.toISOString().split('T')[0] : null;
  const endDate = data.endDate ? data.endDate.toISOString().split('T')[0] : null;

  // Create datetime strings
  const startDateTime = startDate && data.startTime 
    ? `${startDate}T${data.startTime}:00` 
    : null;
  const endDateTime = endDate && data.endTime 
    ? `${endDate}T${data.endTime}:00` 
    : null;

  // Auto-detect timezone if city is provided
  let timezone = data.timezone || 'Europe/Amsterdam';
  if (data.city) {
    try {
      const detectedTimezone = await TimezoneService.getTimezoneForCity(data.city);
      if (detectedTimezone) {
        timezone = detectedTimezone;
      }
    } catch (error) {
      console.warn('Could not detect timezone for city:', data.city);
    }
  }

  return {
    title: data.title,
    description: data.description || '',
    event_category: data.eventCategory || null,
    start_datetime: startDateTime,
    end_datetime: endDateTime,
    destination: data.city || null, // Store city in destination field for area filtering
    venue_name: data.venueName || null,
    address: data.address || null,
    postal_code: data.postalCode || null,
    organizer_link: data.organizerLink || null,
    fee: data.fee || null,
    extra_info: '',
    tags: processedTags,
    vibe: data.vibe || null,
    creator: userId,
    timezone: timezone,
    status: 'published'
  };
};
