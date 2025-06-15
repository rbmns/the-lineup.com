
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const EVENT_CATEGORIES = [
  "Community",
  "Music", 
  "Food",
  "Sports",
  "Art",
  "Culture",
  "Beach",
  "Surf",
  "Yoga",
  "Market",
  "Festival",
  "Game",
  "Party"
];

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM).",
  }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM).",
  }),
  description: z.string().optional(),
  maxAttendees: z
    .string()
    .transform((val) => (val === "" ? undefined : parseInt(val, 10)))
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatePlanFormProps {
  onSubmit: (data: FormValues) => void;
  isLoading?: boolean;
}

export default function CreatePlanForm({
  onSubmit,
  isLoading = false,
}: CreatePlanFormProps) {
  const [date, setDate] = useState<Date>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      location: "",
      startTime: "",
      endTime: "",
      description: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Beach Volleyball Game" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EVENT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-2.5 h-4 w-4 text-primary-75" />
                  <Input
                    className="pl-9"
                    placeholder="Enter location"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span className="text-muted-foreground">
                            Pick a date
                          </span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setDate(date || undefined);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-2.5 h-4 w-4 text-primary-75" />
                      <Input className="pl-9" placeholder="14:00" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-2.5 h-4 w-4 text-primary-75" />
                      <Input className="pl-9" placeholder="16:00" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell people what your plan is about..."
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include any details like what to bring, skill level, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxAttendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Attendees (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  placeholder="Leave empty for unlimited"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Set a limit for how many people can join your plan
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
