
import { z } from 'zod';

export const eventFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  venueName: z.string().optional(),
  address: z.string().optional(),  // Make optional since it's nullable in DB
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().optional(), // Make optional since it's nullable in DB
  startDate: z.date({ required_error: 'Start date is required' }),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.date().optional(),
  endTime: z.string().min(1, 'End time is required'),
  flexibleStartTime: z.boolean().default(false),
  timezone: z.string().default('Europe/Amsterdam'),
  eventCategory: z.string().optional(),
  vibe: z.string().optional(),
  fee: z.string().optional(),
  bookingLink: z.string().url().optional().or(z.literal('')),
  googleMaps: z.string().url().optional().or(z.literal('')),
  additionalInfo: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
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
