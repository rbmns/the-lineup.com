
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface PublishEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: { email: string; password: string; gdprConsent: boolean }) => Promise<void>;
  isSubmitting: boolean;
}

export const PublishEventModal: React.FC<PublishEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!gdprConsent) {
      newErrors.gdprConsent = 'You must accept the terms to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    await onSubmit({ email, password, gdprConsent });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Create your account to publish your event</DialogTitle>
          <DialogDescription className="text-center">
            Join the community and start organizing amazing events!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="gdpr"
              checked={gdprConsent}
              onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
              disabled={isSubmitting}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="gdpr"
                className="text-sm font-normal leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{' '}
                <a href="/terms" className="underline hover:no-underline" target="_blank">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="underline hover:no-underline" target="_blank">
                  Privacy Policy
                </a>
              </Label>
              {errors.gdprConsent && (
                <p className="text-sm text-red-600">{errors.gdprConsent}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Account & Publish'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
