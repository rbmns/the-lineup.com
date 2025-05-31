
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, CalendarDays, User, Shield, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FakeProfileContent: React.FC = () => {
  const fakeStats = [
    { label: 'Events Attended', value: '12' },
    { label: 'Upcoming Events', value: '4' },
    { label: 'Friends', value: '23' }
  ];

  const fakeUpcomingEvents = [
    { title: 'Beach Yoga Session', date: 'Tomorrow 9:00 AM', location: 'Zandvoort Beach' },
    { title: 'Surf Lesson for Beginners', date: 'Friday 2:00 PM', location: 'South Beach' },
    { title: 'Beach Volleyball Tournament', date: 'Saturday 10:00 AM', location: 'Central Beach' },
    { title: 'Sunset Photography Walk', date: 'Sunday 7:00 PM', location: 'Pier Area' }
  ];

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User, shortLabel: 'Personal' },
    { id: 'privacy', label: 'Privacy', icon: Shield, shortLabel: 'Privacy' },
    { id: 'data', label: 'Data Management', icon: Database, shortLabel: 'Data' },
    { id: 'events', label: 'My Events', icon: CalendarDays, shortLabel: 'Events' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 text-center md:text-left">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-gray-500" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Sarah Johnson</h1>
                <p className="text-sm md:text-base text-gray-600 italic mt-1">"Living life one wave at a time"</p>
                <div className="flex items-center justify-center md:justify-start mt-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Zandvoort, Netherlands</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full md:w-auto">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {fakeStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-black">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = index === 3; // Make events tab active by default
              return (
                <button
                  key={tab.id}
                  className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-3 md:py-4 border-b-2 transition-colors whitespace-nowrap text-xs md:text-base min-w-0 ${
                    isActive 
                      ? 'border-gray-400 text-gray-700 bg-gray-50' 
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  <Icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="font-medium hidden sm:block">{tab.label}</span>
                  <span className="font-medium block sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab content - Events */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Events</h2>
              <p className="text-gray-600 mb-6">Your upcoming and past events</p>
            </div>
            
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upcoming" className="text-sm font-medium">
                  Upcoming Events
                </TabsTrigger>
                <TabsTrigger value="past" className="text-sm font-medium">
                  Past Events
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Your Upcoming Events</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {fakeUpcomingEvents.map((event, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-gray-600">{event.date}</p>
                            <p className="text-sm text-gray-500">{event.location}</p>
                          </div>
                          <div className="flex items-center text-green-600 text-sm">
                            ✓ Going
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="past" className="space-y-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Past Events</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Beach Music Festival</h4>
                          <p className="text-sm text-gray-600">Last weekend</p>
                          <p className="text-sm text-gray-500">Main Beach Stage</p>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          ✓ Attended
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
