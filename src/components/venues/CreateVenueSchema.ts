
import { z } from 'zod';

export const CreateVenueSchema = z.object({
  name: z.string().min(3, { message: "Venue name must be at least 3 characters long." }),
  city: z.string().optional(),
  street: z.string().optional(),
  postal_code: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')).optional(),
  google_maps: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')).optional(),
});

export type CreateVenueFormValues = z.infer<typeof CreateVenueSchema>;
