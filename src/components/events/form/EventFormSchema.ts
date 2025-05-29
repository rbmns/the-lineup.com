
import { z } from "zod";

export const EventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  event_category: z.string().nonempty("Please select at least one event category"),
  start_date: z.date({ required_error: "Start date is required" }),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)"),
  end_date: z.date({ required_error: "End date is required" }),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)"),
  venue_id: z.string().nonempty("Please select a venue"),
  organizer_link: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  fee: z.string().or(z.number().min(0, "Fee must be a positive number").transform(val => val.toString())),
  booking_link: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  extra_info: z.string().optional(),
  tags: z.string().optional(),
  vibe: z.string().optional(),
});

export type EventFormValues = z.infer<typeof EventSchema>;
