
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CreatorRequestService } from '@/services/CreatorRequestService';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';

export const RequestCreatorForm: React.FC = () => {
  const [formData, setFormData] = useState({
    reason: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { creatorRequestStatus } = useCreatorStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await CreatorRequestService.requestCreatorAccess(user.id, {
        reason: formData.reason,
        contact_email: formData.contactEmail || undefined,
        contact_phone: formData.contactPhone || undefined,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Request Submitted Successfully! 🎉",
        description: "Your dashboard access request has been submitted and our admin team has been notified. You'll receive an email once it's been reviewed.",
      });

      setFormData({
        reason: '',
        contactEmail: '',
        contactPhone: ''
      });
    } catch (error: any) {
      console.error('Error submitting creator request:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (creatorRequestStatus === 'pending') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Request Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-lg font-medium mb-2">Your Request is Being Reviewed</h3>
              <p className="text-gray-600">
                We're reviewing your dashboard access request. Our admin team has been notified and you'll receive an email once it's been processed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Request Dashboard Access</CardTitle>
          <p className="text-gray-600">
            Apply to become an event organizer and access your management dashboard.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reason">Why do you want to organize events? *</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                placeholder="Tell us about your goals and what types of events you'd like to create"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="Alternative contact email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="Your phone number"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !formData.reason.trim()}
              className="w-full"
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
