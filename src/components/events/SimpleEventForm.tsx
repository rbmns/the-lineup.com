
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Vibe options with emojis
const VIBES = [
  { id: 'chill', label: 'Chill', emoji: '😌' },
  { id: 'adventure', label: 'Adventure', emoji: '🏃' },
  { id: 'social', label: 'Social', emoji: '🎉' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'active', label: 'Active', emoji: '🏃' },
  { id: 'foodie', label: 'Foodie', emoji: '🍴' },
  { id: 'mindful', label: 'Mindful', emoji: '🧘' },
  { id: 'nature', label: 'Nature', emoji: '🌿' }
];

// Category options with emojis
const CATEGORIES = [
  { id: 'surf', label: 'Surf', emoji: '🏄' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'food', label: 'Food', emoji: '🍽️' },
  { id: 'hiking', label: 'Hiking', emoji: '🥾' },
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'coffee', label: 'Coffee', emoji: '☕' }
];

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(3, 'Location is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  capacity: z.string().optional(),
  vibe: z.string().min(1, 'Please select a vibe'),
  category: z.string().min(1, 'Please select a category')
});

type EventFormData = z.infer<typeof eventSchema>;

interface SimpleEventFormProps {
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const SimpleEventForm: React.FC<SimpleEventFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
      capacity: '',
      vibe: '',
      category: ''
    }
  });

  const handleSubmit = (data: EventFormData) => {
    onSubmit({
      ...data,
      vibe: selectedVibe,
      category: selectedCategory
    });
  };

  const handleVibeSelect = (vibeId: string) => {
    setSelectedVibe(vibeId);
    form.setValue('vibe', vibeId);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    form.setValue('category', categoryId);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-midnight mb-2">Create a New Event</h1>
        <p className="text-overcast">Organize an event for the community</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-midnight">Title</Label>
          <Input
            id="title"
            placeholder="Beach Yoga Session"
            className="mt-1"
            {...form.register('title')}
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-midnight">Description</Label>
          <Textarea
            id="description"
            placeholder="Join us for a relaxing yoga session by the beach..."
            className="mt-1 min-h-[80px] resize-none"
            {...form.register('description')}
          />
          {form.formState.errors.description && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location" className="text-sm font-medium text-midnight">Location</Label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-overcast" />
            <Input
              id="location"
              placeholder="Enter location"
              className="pl-10"
              {...form.register('location')}
            />
          </div>
          {form.formState.errors.location && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.location.message}</p>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date" className="text-sm font-medium text-midnight">Date</Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-overcast" />
              <Input
                id="date"
                type="date"
                className="pl-10"
                {...form.register('date')}
              />
            </div>
            {form.formState.errors.date && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.date.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="time" className="text-sm font-medium text-midnight">Time</Label>
            <div className="relative mt-1">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-overcast" />
              <Input
                id="time"
                type="time"
                className="pl-10"
                {...form.register('time')}
              />
            </div>
            {form.formState.errors.time && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.time.message}</p>
            )}
          </div>
        </div>

        {/* Capacity */}
        <div>
          <Label htmlFor="capacity" className="text-sm font-medium text-midnight">Capacity (optional)</Label>
          <Input
            id="capacity"
            placeholder="Maximum number of attendees"
            className="mt-1"
            {...form.register('capacity')}
          />
        </div>

        {/* Vibes */}
        <div>
          <Label className="text-sm font-medium text-midnight">Vibes</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {VIBES.map((vibe) => (
              <button
                key={vibe.id}
                type="button"
                onClick={() => handleVibeSelect(vibe.id)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  selectedVibe === vibe.id
                    ? 'bg-sage text-midnight border-sage'
                    : 'bg-ivory text-overcast border-overcast hover:bg-coconut'
                }`}
              >
                <div className="text-lg mb-1">{vibe.emoji}</div>
                <div className="text-xs">{vibe.label}</div>
              </button>
            ))}
          </div>
          {form.formState.errors.vibe && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.vibe.message}</p>
          )}
        </div>

        {/* Categories */}
        <div>
          <Label className="text-sm font-medium text-midnight">Categories</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategorySelect(category.id)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-sage text-midnight border-sage'
                    : 'bg-ivory text-overcast border-overcast hover:bg-coconut'
                }`}
              >
                <div className="text-lg mb-1">{category.emoji}</div>
                <div className="text-xs">{category.label}</div>
              </button>
            ))}
          </div>
          {form.formState.errors.category && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.category.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-midnight text-ivory hover:bg-overcast"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </Button>
        </div>
      </form>
    </div>
  );
};
