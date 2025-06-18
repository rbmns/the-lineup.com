
import { FormValues, SafeEventData } from './EventFormTypes';

export const processFormData = (data: FormValues, userId: string): SafeEventData => {
  // Process tags - convert string to array
  const processedTags = data.tags 
    ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    : [];

  // Convert dates to ISO strings
  const startDate = data.start_date ? data.start_date.toISOString().split('T')[0] : null;
  const endDate = data.end_date ? data.end_date.toISOString().split('T')[0] : null;

  return {
    title: data.title,
    description: data.description,
    event_category: data.event_category,
    start_date: startDate,
    start_time: data.start_time,
    end_date: endDate,
    end_time: data.end_time,
    venue_id: data.venue_id,
    organizer_link: data.organizer_link || null,
    fee: parseFloat(data.fee) || 0,
    booking_link: data.booking_link || null,
    extra_info: data.extra_info || "",
    tags: processedTags,
    vibe: data.vibe || null,
    created_by: userId,
  };
};
