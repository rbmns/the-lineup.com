
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { getInitials } from '@/utils/profileUtils';

interface AvatarDisplayProps {
  avatarUrl: string | null;
  username: string | null;
  size: string;
  isLoading?: boolean;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatarUrl,
  username,
  size,
  isLoading = false
}) => {
  const sizeMap = {
    xs: 'h-12 w-12',
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
    xl: 'h-40 w-40'
  };

  return (
    <div className="relative group transform transition-all duration-300 hover:scale-105">
      <div className="absolute -inset-2 bg-gradient-to-r from-gray-300/20 to-gray-300/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <Avatar className={`border-4 border-white shadow-lg ${sizeMap[size as keyof typeof sizeMap]}`}>
        <AvatarImage 
          src={avatarUrl || ""} 
          alt={username || ''}
          className="object-cover" 
        />
        <AvatarFallback className="text-2xl bg-gradient-to-r from-gray-100 to-gray-200">
          {getInitials(username || '')}
        </AvatarFallback>
      </Avatar>
      
      <label 
        htmlFor="avatar-upload" 
        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <Camera className="h-6 w-6" />
      </label>
    </div>
  );
};
