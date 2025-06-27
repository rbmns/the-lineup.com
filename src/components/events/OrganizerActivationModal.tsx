
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const organizerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  bio: z.string().optional(),
  website: z.string().optional()
});

type OrganizerData = z.infer<typeof organizerSchema>;

interface OrganizerActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrganizerData) => void;
  isSubmitting?: boolean;
}

export const OrganizerActivationModal: React.FC<OrganizerActivationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const form = useForm<OrganizerData>({
    resolver: zodResolver(organizerSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      website: ''
    }
  });

  const handleSubmit = (data: OrganizerData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-midnight">
            Tell us about you as the host
          </DialogTitle>
          <p className="text-center text-overcast mt-2">
            To publish your event, we need a few details about you as the organizer.
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
          {/* Name */}
          <div>
            <Label htmlFor="org-name" className="text-sm font-medium text-midnight">
              Your Name or Display Name *
            </Label>
            <Input
              id="org-name"
              placeholder="How should we display your name?"
              className="mt-1"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="org-email" className="text-sm font-medium text-midnight">
              Email Address *
            </Label>
            <Input
              id="org-email"
              type="email"
              placeholder="your@email.com"
              className="mt-1"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          {/* Bio (optional) */}
          <div>
            <Label htmlFor="org-bio" className="text-sm font-medium text-midnight">
              Short Bio (Optional)
            </Label>
            <Textarea
              id="org-bio"
              placeholder="Tell people a bit about yourself..."
              className="mt-1 min-h-[60px] resize-none"
              {...form.register('bio')}
            />
          </div>

          {/* Website/Social (optional) */}
          <div>
            <Label htmlFor="org-website" className="text-sm font-medium text-midnight">
              Website or Social Link (Optional)
            </Label>
            <Input
              id="org-website"
              placeholder="https://your-website.com or @instagram"
              className="mt-1"
              {...form.register('website')}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
              {isSubmitting ? 'Publishing...' : 'Publish Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
