
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HowItWorksProps {
  className?: string;
}

const HowItWorksSection: React.FC<HowItWorksProps> = ({ className }) => {
  return (
    <section className={cn("py-12 bg-secondary", className)}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <CardTitle>Discover Events</CardTitle>
            </CardHeader>
            <CardContent>
              Browse a wide range of events happening near you. Find something that sparks your interest!
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <CardTitle>Join the Fun</CardTitle>
            </CardHeader>
            <CardContent>
              RSVP to events, connect with other attendees, and get ready to have a great time.
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <CardTitle>Share Your Experience</CardTitle>
            </CardHeader>
            <CardContent>
              Share your event experiences with friends and the community. Help others discover amazing events!
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-8">
          <Button size="lg">Explore Events</Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
