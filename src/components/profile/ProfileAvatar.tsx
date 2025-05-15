
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/profileUtils';

interface ProfileAvatarProps {
  profile: any;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  profile,
  size = 'md',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };
  
  let avatarUrl = '';
  
  if (profile?.avatar_url && !imageError) {
    if (Array.isArray(profile.avatar_url) && profile.avatar_url.length > 0) {
      avatarUrl = profile.avatar_url[0];
    } else if (typeof profile.avatar_url === 'string') {
      avatarUrl = profile.avatar_url;
    }
  }
    
  return (
    <Avatar className={`${sizeMap[size]} border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <AvatarImage 
        src={avatarUrl} 
        alt={profile?.username || ''}
        className="object-cover w-full h-full"
        onError={() => setImageError(true)}
      />
      <AvatarFallback className="bg-gray-100 text-gray-800">
        {getInitials(profile?.username || profile?.email || '?')}
      </AvatarFallback>
    </Avatar>
  );
};
