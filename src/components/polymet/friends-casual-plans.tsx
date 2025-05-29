import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/polymet/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CategoryBadge from "@/components/polymet/category-badge";

// Mock data for demo purposes
const mockCasualPlansData = {
  friendsPlans: [
    {
      id: "1",
      title: "Beach Volleyball",
      category: "Sports",
      organizer: "Mike Chen",
      date: "Tomorrow",
      time: "2:00 PM",
      location: "Santa Monica Beach",
      attendees: 6,
      maxAttendees: 8
    }
  ]
};

interface FriendsCasualPlansProps {
  className?: string;
}

export default function FriendsCasualPlans({ className }: FriendsCasualPlansProps) {
  const { friendsPlans } = mockCasualPlansData;

  return (
    <Card className={cn("bg-white shadow-sm", className)}>
      <CardHeader>
        <CardTitle>Friends' Casual Plans</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-secondary-50">
          {friendsPlans.map((plan) => (
            <li key={plan.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <CategoryBadge category={plan.category} />
                    <Badge variant="secondary">{plan.attendees}/{plan.maxAttendees}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{plan.title}</h3>
                  <p className="text-sm text-primary-75">
                    {plan.date}, {plan.time} at {plan.location}
                  </p>
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{plan.organizer.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </li>
          ))}
        </ul>
        <div className="p-4">
          <Button variant="outline" className="w-full border-primary-50 text-primary hover:bg-primary-10">
            View All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
