
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateCasualPlanData, CASUAL_PLAN_VIBES } from '@/types/casual-plans';
import { X } from 'lucide-react';

interface CreateCasualPlanFormProps {
  onSubmit: (data: CreateCasualPlanData) => void;
  onCancel: () => void;
  isCreating: boolean;
}

export const CreateCasualPlanForm: React.FC<CreateCasualPlanFormProps> = ({
  onSubmit,
  onCancel,
  isCreating,
}) => {
  const [formData, setFormData] = useState<CreateCasualPlanData>({
    title: '',
    description: '',
    vibe: '',
    location: '',
    date: '',
    time: '',
    max_attendees: 20,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.vibe || !formData.location || !formData.date || !formData.time) {
      return;
    }
    onSubmit(formData);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[95vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Create a Casual Plan</h2>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">Plan Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Morning surf session"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="vibe" className="text-sm font-medium">Vibe *</Label>
              <Select value={formData.vibe} onValueChange={(value) => setFormData({ ...formData, vibe: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a vibe" />
                </SelectTrigger>
                <SelectContent>
                  {CASUAL_PLAN_VIBES.map((vibe) => (
                    <SelectItem key={vibe} value={vibe} className="capitalize">
                      {vibe}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Vondelpark, Amsterdam"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="date" className="text-sm font-medium">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={today}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-sm font-medium">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details about your plan..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="max_attendees" className="text-sm font-medium">Max Attendees</Label>
              <Input
                id="max_attendees"
                type="number"
                value={formData.max_attendees}
                onChange={(e) => setFormData({ ...formData, max_attendees: parseInt(e.target.value) })}
                min={2}
                max={50}
                className="mt-1"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating} className="flex-1">
                {isCreating ? 'Creating...' : 'Create Plan'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
