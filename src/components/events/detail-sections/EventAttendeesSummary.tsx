import React, { useState, useEffect } from 'react';
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
  const {
    user
  } = useAuth();
  const [friendAttendees, setFriendAttendees] = useState<{
    going: any[];
    interested: any[];
  }>({
    going: [],
    interested: []
  });
  useEffect(() => {
    const fetchFriendAttendees = async () => {
      if (!user?.id || !attendees) return;
      console.log('EventAttendeesSummary - Starting to fetch friend attendees:', {
        userId: user.id,
        attendeesGoing: attendees.going,
        attendeesInterested: attendees.interested
      });
      try {
        const friendsGoing = await filterFriendsFromAttendees(attendees.going, user.id);
        const friendsInterested = await filterFriendsFromAttendees(attendees.interested, user.id);
        console.log('EventAttendeesSummary - Friend attendees found:', {
          friendsGoing,
          friendsInterested
        });
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
  return <div>
      <h3 className="text-lg font-montserrat text-graphite-grey mb-4">
        Friends Attending
      </h3>
      
      {user && hasFriendAttendees ? <div className="space-y-6">
          {/* Friends Going */}
          {friendAttendees.going.length > 0 && <div>
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-h4 font-montserrat text-graphite-grey">Going</h4>
                <span className="text-h4 font-montserrat text-graphite-grey/70">{friendAttendees.going.length}</span>
              </div>
              
              <div className="space-y-2">
                {friendAttendees.going.map(friend => <div key={friend.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-coastal-haze/50 cursor-pointer transition-colors" onClick={() => window.location.href = `/user/${friend.id}`}>
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-mist-grey flex-shrink-0">
                      <img src={friend.avatar_url?.[0] || '/img/default-avatar.png'} alt={friend.username || 'User'} className="w-full h-full object-cover" onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = '/img/default-avatar.png';
              }} />
                    </div>
                    <span className="text-body-base font-lato text-graphite-grey">
                      {friend.username || 'Anonymous'}
                    </span>
                  </div>)}
              </div>
            </div>}

          {/* Friends Interested */}
          {friendAttendees.interested.length > 0 && <div>
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-h4 font-montserrat text-graphite-grey">Interested</h4>
                <span className="text-h4 font-montserrat text-graphite-grey/70">{friendAttendees.interested.length}</span>
              </div>
              
              <div className="space-y-2">
                {friendAttendees.interested.map(friend => <div key={friend.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-coastal-haze/50 cursor-pointer transition-colors" onClick={() => window.location.href = `/user/${friend.id}`}>
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-mist-grey flex-shrink-0">
                      <img src={friend.avatar_url?.[0] || '/img/default-avatar.png'} alt={friend.username || 'User'} className="w-full h-full object-cover" onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = '/img/default-avatar.png';
              }} />
                    </div>
                    <span className="text-body-base font-lato text-graphite-grey">
                      {friend.username || 'Anonymous'}
                    </span>
                  </div>)}
              </div>
            </div>}

          {/* Total Counts */}
          <div className="pt-4 border-t border-mist-grey/30">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-body-base font-lato text-graphite-grey">Going: </span>
                <span className="text-body-base font-lato font-medium text-graphite-grey">{goingCount}</span>
              </div>
              <div>
                <span className="text-body-base font-lato text-graphite-grey">Interested: </span>
                <span className="text-body-base font-lato font-medium text-graphite-grey">{interestedCount}</span>
              </div>
            </div>
          </div>
        </div> : <div className="flex items-center gap-6">
          <div>
            <span className="text-body-base font-lato text-graphite-grey">Going: </span>
            <span className="text-body-base font-lato font-medium text-graphite-grey">{goingCount}</span>
          </div>
          <div>
            <span className="text-body-base font-lato text-graphite-grey">Interested: </span>
            <span className="text-body-base font-lato font-medium text-graphite-grey">{interestedCount}</span>
          </div>
        </div>}
    </div>;
};