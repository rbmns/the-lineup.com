
import { z } from 'zod';

export const CreateVenueSchema = z.object({
  name: z.string().min(3, { message: "Venue name must be at least 3 characters long." }),
  city: z.string().optional(),
  street: z.string().optional(),
  postal_code: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')).optional(),
  google_maps: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')).optional(),
}).refine((data) => {
  // Require either address information (street + city) OR Google Maps link
  const hasAddress = (data.street && data.street.trim()) || (data.city && data.city.trim());
  const hasGoogleMaps = data.google_maps && data.google_maps.trim();
  
  return hasAddress || hasGoogleMaps;
}, {
  message: "Please provide either an address (street/city) or a Google Maps link",
  path: ["street"] // Show error on street field
});

export type CreateVenueFormValues = z.infer<typeof CreateVenueSchema>;
