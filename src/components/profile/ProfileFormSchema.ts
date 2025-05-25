
import * as z from "zod";

export const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .optional(),
  location: z.string().optional(),
  tagline: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type ProfileFormData = ProfileFormValues; // Add alias for backward compatibility
