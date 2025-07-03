
import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { EventFriendRsvps } from '@/components/events/EventFriendRsvps';
import { filterFriendsFromAttendees } from '@/services/friendsService';
import { useAuth } from '@/contexts/AuthContext';

interface EventAttendeesSummaryProps {
  goingCount: number;
  interestedCount: number;
  attendees?: {
    going: any[];
    interested: any[];
  };
}

export const EventAttendeesSummary = ({
  goingCount,
  interestedCount,
  attendees
}: EventAttendeesSummaryProps) => {
  const { user } = useAuth();
  const [friendAttendees, setFriendAttendees] = useState<{
    going: any[];
    interested: any[];
  }>({ going: [], interested: [] });

  useEffect(() => {
    const fetchFriendAttendees = async () => {
      if (!user?.id || !attendees) return;

      try {
        const friendsGoing = await filterFriendsFromAttendees(attendees.going, user.id);
        const friendsInterested = await filterFriendsFromAttendees(attendees.interested, user.id);
        
        setFriendAttendees({
          going: friendsGoing,
          interested: friendsInterested
        });
      } catch (error) {
        console.error('Error filtering friend attendees:', error);
      }
    };

    fetchFriendAttendees();
  }, [user?.id, attendees]);

  const hasFriendAttendees = friendAttendees.going.length > 0 || friendAttendees.interested.length > 0;

  return (
    <div>
      <h3 className="font-medium flex items-center gap-2 mb-3">
        <Users className="h-5 w-5" /> 
        <span>Who's coming</span>
      </h3>
      
      {user && hasFriendAttendees ? (
        <>
          <EventFriendRsvps 
            going={friendAttendees.going} 
            interested={friendAttendees.interested} 
          />
          <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-xl font-bold">{goingCount}</div>
              <div className="text-sm text-gray-600">Total Going</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{interestedCount}</div>
              <div className="text-sm text-gray-600">Total Interested</div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-xl font-bold">{goingCount}</div>
            <div className="text-sm text-gray-600">Going</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{interestedCount}</div>
            <div className="text-sm text-gray-600">Interested</div>
          </div>
        </div>
      )}
    </div>
  );
};
