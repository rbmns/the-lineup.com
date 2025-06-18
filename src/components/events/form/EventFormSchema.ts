
import { z } from "zod";
import { EVENT_CATEGORIES } from "@/utils/categorySystem";

// Custom URL validation that's more lenient
const urlSchema = z.string().refine((val) => {
  if (!val || val.trim() === '') return true; // Allow empty strings
  
  const trimmedVal = val.trim();
  
  // Check if it's a valid URL format (with or without protocol)
  try {
    // Try with http:// prefix if no protocol is present
    const urlToTest = trimmedVal.match(/^https?:\/\//i) ? trimmedVal : `http://${trimmedVal}`;
    new URL(urlToTest);
    return true;
  } catch {
    return false;
  }
}, {
  message: "Please enter a valid URL (protocol will be added automatically if missing)"
});

export const EventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  event_category: z.enum(EVENT_CATEGORIES, { 
    errorMap: () => ({ message: "Please select a valid event category" })
  }),
  start_date: z.date({ required_error: "Start date is required" }),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)"),
  end_date: z.date({ required_error: "End date is required" }),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time (HH:MM)"),
  venue_id: z.string().nonempty("Please select a venue"),
  organizer_link: urlSchema,
  fee: z.string().or(z.number().min(0, "Fee must be a positive number").transform(val => val.toString())),
  booking_link: urlSchema,
  extra_info: z.string().optional(),
  tags: z.string().optional(),
  vibe: z.string().nullable().optional(),
});

export type EventFormValues = z.infer<typeof EventSchema>;
