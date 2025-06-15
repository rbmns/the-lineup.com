
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data for demo purposes
const mockUserEventsData = {
  suggestedFriends: [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/api/placeholder/32/32",
      mutualFriends: 3,
      location: "San Francisco, CA"
    }
  ]
};

interface FriendSuggestion {
  id: string;
  name: string;
  avatar?: string;
  mutualFriends: number;
  location: string;
}

interface FriendSuggestionsCardProps {
  suggestedFriends?: FriendSuggestion[];
  className?: string;
}

export default function FriendSuggestionsCard({
  suggestedFriends = mockUserEventsData.suggestedFriends,
  className,
}: FriendSuggestionsCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Suggested Friends</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {suggestedFriends.map((friend) => (
            <li key={friend.id} className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  {friend.avatar ? (
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                  ) : (
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{friend.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {friend.mutualFriends} mutual friends
                  </p>
                  <p className="text-xs text-muted-foreground">{friend.location}</p>
                </div>
              </div>
              <Button size="sm">Add Friend</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
