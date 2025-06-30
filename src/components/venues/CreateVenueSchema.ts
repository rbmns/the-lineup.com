
import { z } from 'zod';

export const CreateVenueSchema = z.object({
  name: z.string().min(3, { message: "Venue name must be at least 3 characters long." }),
  street: z.string().min(1, { message: "Street address is required." }),
  city: z.string().min(1, { message: "City is required." }),
  postal_code: z.string().min(1, { message: "Postal code is required." }),
  website: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')).optional(),
  google_maps: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')).optional(),
});

export type CreateVenueFormValues = z.infer<typeof CreateVenueSchema>;
