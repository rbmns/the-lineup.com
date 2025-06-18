
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
    businessName: '',
    businessType: '',
    experience: '',
    reason: ''
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
      await CreatorRequestService.submitCreatorRequest({
        user_id: user.id,
        business_name: formData.businessName,
        business_type: formData.businessType,
        experience: formData.experience,
        reason: formData.reason
      });

      toast({
        title: "Request Submitted",
        description: "Your dashboard access request has been submitted for review.",
      });

      setFormData({
        businessName: '',
        businessType: '',
        experience: '',
        reason: ''
      });
    } catch (error) {
      console.error('Error submitting creator request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
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
                We're reviewing your dashboard access request. You'll receive an email once it's been processed.
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
              <Label htmlFor="businessName">Business/Organization Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                placeholder="Enter your business or organization name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Type of Business/Organization</Label>
              <Input
                id="businessType"
                value={formData.businessType}
                onChange={(e) => handleChange('businessType', e.target.value)}
                placeholder="e.g., Restaurant, Fitness Studio, Community Group"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Event Organization Experience</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                placeholder="Tell us about your experience organizing events (if any)"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Why do you want to organize events?</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                placeholder="What types of events would you like to create and why?"
                rows={3}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
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
