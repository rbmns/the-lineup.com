
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users } from 'lucide-react';
import { CasualPlan } from '@/types/casual-plans';

interface FriendCasualPlanCardProps {
  plan: CasualPlan & {
    is_friend_creator?: boolean;
    friend_attending?: boolean;
  };
}

export const FriendCasualPlanCard: React.FC<FriendCasualPlanCardProps> = ({ plan }) => {
  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarUrl = (avatarUrl?: string[]) => {
    if (avatarUrl && Array.isArray(avatarUrl) && avatarUrl.length > 0) {
      return avatarUrl[0];
    }
    return null;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">{plan.vibe === 'surf' ? '🏄' : plan.vibe === 'party' ? '🎉' : plan.vibe === 'chill' ? '😌' : '🌊'}</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 truncate">{plan.title}</h3>
            {plan.is_friend_creator && (
              <Badge variant="outline">Creator</Badge>
            )}
            {plan.friend_attending && !plan.is_friend_creator && (
              <Badge variant="secondary">Attending</Badge>
            )}
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(plan.date)} • {formatTime(plan.time)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{plan.location}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{plan.attendee_count || 0} attending</span>
              {plan.max_attendees && (
                <span>• {plan.max_attendees} max</span>
              )}
            </div>
          </div>
          
          {plan.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{plan.description}</p>
          )}
          
          {plan.creator_profile && (
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
              <Avatar className="h-6 w-6">
                <AvatarImage src={getAvatarUrl(plan.creator_profile.avatar_url) || undefined} />
                <AvatarFallback className="text-xs">
                  {getInitials(plan.creator_profile.username)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-500">
                {plan.is_friend_creator 
                  ? `Created by ${plan.creator_profile.username}`
                  : `${plan.creator_profile.username} is attending`
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
