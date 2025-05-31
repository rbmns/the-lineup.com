
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, User, Calendar } from 'lucide-react';

export const FakeFriendsContent: React.FC = () => {
  const fakeFriends = [
    { id: 1, name: 'Alex Chen', location: 'Zandvoort Center', status: 'Surfing every morning 🏄‍♂️', avatar: 'AC' },
    { id: 2, name: 'Maria Santos', location: 'Beach District', status: 'Yoga instructor & beach lover', avatar: 'MS' },
    { id: 3, name: 'Tom Bakker', location: 'Noord', status: 'Local photographer', avatar: 'TB' },
    { id: 4, name: 'Lisa Wagner', location: 'Centrum', status: 'Always up for beach volleyball!', avatar: 'LW' },
    { id: 5, name: 'Jean Dubois', location: 'Zuid', status: 'Digital nomad working remotely', avatar: 'JD' }
  ];

  const fakeSuggestions = [
    { id: 6, name: 'Emma Johnson', location: 'Beach Area', reason: 'You both attended "Beach Music Festival"', avatar: 'EJ' },
    { id: 7, name: 'Carlos Rodriguez', location: 'Centrum', reason: 'You both attended "Surf Competition"', avatar: 'CR' },
    { id: 8, name: 'Nina Petrov', location: 'Noord', reason: 'You both attended "Yoga on the Beach"', avatar: 'NP' }
  ];

  const fakeRequests = [
    { id: 9, name: 'James Wilson', location: 'South District', message: 'Hey! Saw you at the beach volleyball game', avatar: 'JW' },
    { id: 10, name: 'Sophie Miller', location: 'Central Area', message: 'Would love to connect after meeting at the café', avatar: 'SM' }
  ];

  const fakeEvents = [
    { title: 'Beach Cleanup', friend: 'Alex Chen', date: 'Tomorrow 10:00 AM', attendees: 12 },
    { title: 'Surf Lesson', friend: 'Maria Santos', date: 'Friday 2:00 PM', attendees: 8 },
    { title: 'Photography Walk', friend: 'Tom Bakker', date: 'Saturday 6:00 PM', attendees: 15 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-6 md:py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Friends</h1>
            <p className="text-gray-600 mt-2">Connect with travelers and locals in your area</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-4 py-4 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search friends..." 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-6 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-3 md:p-6">
            {/* Tabs */}
            <div className="flex border-b mb-6">
              <button className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-medium">
                All Friends ({fakeFriends.length})
              </button>
              <button className="px-4 py-2 text-gray-500 font-medium ml-4">
                Suggestions ({fakeSuggestions.length})
              </button>
              <button className="px-4 py-2 text-gray-500 font-medium ml-4">
                Requests ({fakeRequests.length})
              </button>
              <button className="px-4 py-2 text-gray-500 font-medium ml-4">
                Events ({fakeEvents.length})
              </button>
            </div>

            {/* Friends List */}
            <div className="space-y-4">
              {fakeFriends.map((friend) => (
                <Card key={friend.id} className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {friend.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{friend.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {friend.location}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{friend.status}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Message
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Hidden sections preview */}
            <div className="mt-8 space-y-6">
              <div className="opacity-50">
                <h3 className="text-lg font-semibold mb-4">Friend Suggestions</h3>
                <div className="space-y-3">
                  {fakeSuggestions.slice(0, 2).map((suggestion) => (
                    <Card key={suggestion.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {suggestion.avatar}
                          </div>
                          <div>
                            <h4 className="font-medium">{suggestion.name}</h4>
                            <p className="text-sm text-gray-600">{suggestion.reason}</p>
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button size="sm">Add Friend</Button>
                          <Button variant="outline" size="sm">Dismiss</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="opacity-50">
                <h3 className="text-lg font-semibold mb-4">Upcoming Friend Events</h3>
                <div className="space-y-3">
                  {fakeEvents.slice(0, 2).map((event, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-600">Hosted by {event.friend}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.date} • {event.attendees} attending
                          </div>
                        </div>
                        <Button size="sm">Interested</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
