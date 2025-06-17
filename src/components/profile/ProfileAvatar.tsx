
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/profileUtils';
import { processImageUrls } from '@/utils/imageUtils';

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
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };
  
  // Use processImageUrls to handle both array and string formats - ensures avatar_url is always treated as array
  const avatarUrls = processImageUrls(profile?.avatar_url);
  const avatarUrl = !imageError && avatarUrls.length > 0 ? avatarUrls[0] : '';
  
  console.log('ProfileAvatar - profile avatar_url:', profile?.avatar_url);
  console.log('ProfileAvatar - processed URLs:', avatarUrls);
  console.log('ProfileAvatar - using URL:', avatarUrl);
    
  return (
    <Avatar className={`${sizeMap[size]} border border-gray-200 shadow-sm overflow-hidden aspect-square ${className}`}>
      <AvatarImage 
        src={avatarUrl} 
        alt={profile?.username || ''}
        className="object-cover w-full h-full"
        onError={() => {
          console.log('ProfileAvatar - Image load error for URL:', avatarUrl);
          setImageError(true);
        }}
        onLoad={() => {
          console.log('ProfileAvatar - Image loaded successfully:', avatarUrl);
        }}
      />
      <AvatarFallback className="bg-gray-100 text-gray-800 text-xs">
        {getInitials(profile?.username || profile?.email || '?')}
      </AvatarFallback>
    </Avatar>
  );
};
