
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export const FakeCasualPlansContent: React.FC = () => {
  const fakePlans = [
    {
      id: 1,
      title: 'Morning Beach Walk',
      description: 'Join me for a peaceful walk along the coastline. Perfect way to start the day!',
      date: 'Tomorrow',
      location: 'Zandvoort Beach North',
      attendees: 3,
      isGoing: true
    },
    {
      id: 2,
      title: 'Coffee & Coworking',
      description: 'Working remotely? Let\'s grab coffee and work together at a beachside café.',
      date: 'Friday, 2:00 PM',
      location: 'Beach Café Central',
      attendees: 5,
      isGoing: false
    },
    {
      id: 3,
      title: 'Sunset Photography Session',
      description: 'Bringing my camera to capture the golden hour. All photography levels welcome!',
      date: 'Saturday, 7:00 PM',
      location: 'South Pier',
      attendees: 7,
      isGoing: true
    },
    {
      id: 4,
      title: 'Beach Volleyball Practice',
      description: 'Casual volleyball game, no experience needed. Just bring your energy!',
      date: 'Sunday, 4:00 PM',
      location: 'Central Beach Courts',
      attendees: 8,
      isGoing: false
    },
    {
      id: 5,
      title: 'Local Food Market Tour',
      description: 'Exploring the weekly farmers market. Let\'s discover local treats together!',
      date: 'Next Tuesday, 10:00 AM',
      location: 'Town Square Market',
      attendees: 4,
      isGoing: false
    },
    {
      id: 6,
      title: 'Meditation by the Sea',
      description: 'Guided meditation session with ocean sounds. Bring a mat or towel.',
      date: 'Next Wednesday, 7:00 AM',
      location: 'Quiet Beach Area',
      attendees: 6,
      isGoing: true
    }
  ];

  return (
    <div className="w-full">
      <PageHeader 
        title="Casual Plans"
        subtitle="Create and join spontaneous plans with travelers and locals. From beach walks to coffee meetups."
      />

      <div className="px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fakePlans.map(plan => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{plan.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{plan.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{plan.attendees} attendee{plan.attendees !== 1 ? 's' : ''}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div>
                    {plan.isGoing && (
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Going
                      </div>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant={plan.isGoing ? 'secondary' : 'outline'}
                    >
                      Going
                    </Button>
                    <Button variant="outline">
                      Not Going
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-6">
            <Button>
              Create a New Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
