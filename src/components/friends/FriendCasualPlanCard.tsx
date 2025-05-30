
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users } from 'lucide-react';
import { CasualPlan } from '@/types/casual-plans';

interface FriendCasualPlanCardProps {
  plan: CasualPlan;
}

export const FriendCasualPlanCard: React.FC<FriendCasualPlanCardProps> = ({ plan }) => {
  const getInitials = (username: string | null) => {
    if (!username) return '?';
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarUrl = (avatarUrl: string[] | null | undefined) => {
    if (avatarUrl && Array.isArray(avatarUrl) && avatarUrl.length > 0) {
      return avatarUrl[0];
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={getAvatarUrl(plan.creator_profile?.avatar_url) || undefined} />
          <AvatarFallback>{getInitials(plan.creator_profile?.username || null)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{plan.title}</h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(plan.date)} • {formatTime(plan.time)}
          </div>
          
          {plan.location && (
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              {plan.location}
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <span>Created by: </span>
            <span className="font-medium ml-1">{plan.creator_profile?.username || 'Unknown'}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          {plan.attendee_count || 0}
        </div>
      </div>
    </Card>
  );
};
