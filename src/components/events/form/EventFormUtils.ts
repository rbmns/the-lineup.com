
import { EventFormData } from './EventFormSchema';
import { toZonedTime } from 'date-fns-tz';

export const processFormData = async (data: EventFormData, userId: string | null) => {
  console.log('🔄 Processing form data for user:', userId);
  console.log('📋 Raw form data:', data);
  console.log('📅 Start date:', data.startDate, 'Start time:', data.startTime);
  console.log('📍 Location data:', { venueName: data.venueName, address: data.address, city: data.city, postalCode: data.postalCode });
  console.log('🌍 Event timezone:', data.timezone);
  
  // Convert date and time to datetime in the event's timezone
  const startDateTime = data.startDate && data.startTime 
    ? (() => {
        // Create the datetime string in the event's timezone
        const dateStr = `${data.startDate.toISOString().split('T')[0]}T${data.startTime}:00`;
        const localDateTime = new Date(dateStr);
        
        // Convert to the event's timezone
        const zonedDateTime = toZonedTime(localDateTime, data.timezone || 'Europe/Amsterdam');
        console.log('⏰ Start time conversion:', {
          input: `${data.startTime} (${data.timezone})`,
          localDateTime: localDateTime.toISOString(),
          zonedDateTime: zonedDateTime.toISOString()
        });
        
        return zonedDateTime;
      })()
    : null;
    
  const endDateTime = data.endDate && data.endTime 
    ? (() => {
        const dateStr = `${data.endDate.toISOString().split('T')[0]}T${data.endTime}:00`;
        const localDateTime = new Date(dateStr);
        const zonedDateTime = toZonedTime(localDateTime, data.timezone || 'Europe/Amsterdam');
        return zonedDateTime;
      })()
    : null;

  // Process tags
  const tagsArray = data.tags || [];
  const tagsString = tagsArray.length > 0 ? tagsArray.join(', ') : null;

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
    organizer_link: data.organizerLink || null,
    fee: data.fee || null,
    extra_info: null, // Remove the reference to data.extraInfo since it doesn't exist in the schema
    tags: tagsString,
    vibe: data.vibe || null,
    creator: userId, // Will be null for unauthenticated users, filled in after auth
    timezone: data.timezone || 'Europe/Amsterdam',
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
