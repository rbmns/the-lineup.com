
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';

export const EventRsvpButtonsShowcase = () => {
  const handleDemoRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    console.log(`Demo RSVP: ${status}`);
    return true;
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-6">RSVP Buttons</h2>
        
        <div className="space-y-8">
          {/* Default RSVP Button */}
          <div>
            <h3 className="text-lg font-medium mb-3">Default RSVP Button</h3>
            <EventRsvpButtons
              currentStatus={null}
              onRsvp={handleDemoRsvp}
            />
          </div>
          
          {/* RSVP Button with Initial Status */}
          <div>
            <h3 className="text-lg font-medium mb-3">RSVP Button with Initial Status</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Going</p>
                <EventRsvpButtons
                  currentStatus="Going"
                  onRsvp={handleDemoRsvp}
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Interested</p>
                <EventRsvpButtons
                  currentStatus="Interested"
                  onRsvp={handleDemoRsvp}
                />
              </div>
            </div>
          </div>
          
          {/* RSVP Button Sizes */}
          <div>
            <h3 className="text-lg font-medium mb-3">RSVP Button Sizes</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Small</p>
                <EventRsvpButtons
                  currentStatus={null}
                  onRsvp={handleDemoRsvp}
                  size="sm"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Default</p>
                <EventRsvpButtons
                  currentStatus={null}
                  onRsvp={handleDemoRsvp}
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Large</p>
                <EventRsvpButtons
                  currentStatus={null}
                  onRsvp={handleDemoRsvp}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
