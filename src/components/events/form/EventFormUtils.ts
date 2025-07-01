
import { EventFormData } from './EventFormSchema';

export const processFormData = async (data: EventFormData, userId: string | null) => {
  console.log('🔄 Processing form data for user:', userId);
  console.log('📋 Raw form data:', data);
  console.log('📅 Start date:', data.startDate, 'Start time:', data.startTime);
  console.log('📍 Location data:', { venueName: data.venueName, address: data.address, city: data.city, postalCode: data.postalCode });
  
  // Convert date and time to datetime
  const startDateTime = data.startDate && data.startTime 
    ? new Date(`${data.startDate.toISOString().split('T')[0]}T${data.startTime}:00`)
    : null;
    
  const endDateTime = data.endDate && data.endTime 
    ? new Date(`${data.endDate.toISOString().split('T')[0]}T${data.endTime}:00`)
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
