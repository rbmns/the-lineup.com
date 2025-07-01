
import { z } from 'zod';

export const eventFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  venueId: z.string().optional(),
  location: z.string().optional(),
  startDate: z.date({ required_error: 'Start date is required' }),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.date().optional(),
  endTime: z.string().optional(),
  flexibleStartTime: z.boolean().default(false),
  timezone: z.string().default('Europe/Amsterdam'),
  eventCategory: z.string().optional(),
  vibe: z.string().optional(),
  fee: z.string().optional(),
  organizerLink: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
}).refine((data) => {
  // If end date is provided, it should be >= start date
  if (data.endDate && data.startDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

export type EventFormData = z.infer<typeof eventFormSchema>;
