
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, X, Calendar } from 'lucide-react';

// Mock data for demo purposes
const mockEventBasedSuggestions = [
  {
    id: "1",
    name: "Emma Wilson",
    avatar: "/lovable-uploads/68eaf77e-c1bd-4326-bfdc-72328318f27d.png",
    mutualEvents: 2,
    lastMutualEvent: {
      name: "Morning Surf Lesson",
      date: "Sun, 2 June"
    }
  },
  {
    id: "2", 
    name: "Michael Brown",
    avatar: "/lovable-uploads/f267f114-6e86-4d02-8d3f-73fa925ee229.png",
    mutualEvents: 1,
    lastMutualEvent: {
      name: "Live Jazz Night",
      date: "Fri, 31 May"
    }
  },
  {
    id: "3",
    name: "Sophia Garcia", 
    avatar: "/lovable-uploads/7f287109-ef9d-4780-ae28-713458ecf85c.png",
    mutualEvents: 3,
    lastMutualEvent: {
      name: "Beach Cleanup Initiative",
      date: "Sat, 25 May"
    }
  },
  {
    id: "4",
    name: "Liam Johnson",
    avatar: "/lovable-uploads/f39f1180-1b8d-49c7-9477-31b3255fc461.png", 
    mutualEvents: 2,
    lastMutualEvent: {
      name: "Local Art Exhibition",
      date: "Sun, 19 May"
    }
  }
];

interface EventBasedSuggestionsProps {
  onAddFriend?: (friendId: string) => void;
  onDismiss?: (friendId: string) => void;
}

export const EventBasedSuggestions: React.FC<EventBasedSuggestionsProps> = ({
  onAddFriend,
  onDismiss
}) => {
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-center mb-2">Friend Suggestions Based on Events</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">People You May Know</h3>
          <p className="text-sm text-gray-600">Based on events you've attended</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {mockEventBasedSuggestions.map((person) => (
          <div key={person.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-4 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage src={person.avatar} alt={person.name} />
                <AvatarFallback>{getInitials(person.name)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{person.name}</h4>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddFriend?.(person.id)}
                      className="flex items-center gap-1"
                    >
                      <UserPlus className="h-4 w-4" />
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDismiss?.(person.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {person.mutualEvents} mutual event{person.mutualEvents > 1 ? 's' : ''}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded p-2">
                  <Calendar className="h-3 w-3" />
                  <span>You both attended {person.lastMutualEvent.name}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1 ml-5">
                  {person.lastMutualEvent.date}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
          See all suggestions
        </Button>
      </div>
    </Card>
  );
};
