
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { useAuth } from '@/contexts/AuthContext';
import { AvatarDisplay } from './AvatarDisplay';
import { UploadProgress } from './UploadProgress';
import { useAvatarState } from '@/hooks/useAvatarState';

interface AvatarUploadWrapperProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AvatarUploadWrapper: React.FC<AvatarUploadWrapperProps> = ({ 
  size = 'md',
  className
}) => {
  const { uploadAvatar, uploading } = useAvatarUpload();
  const { profile } = useAuth();
  const { preview, setPreview, getAvatarUrl } = useAvatarState();
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    console.log('File selected for upload:', file.name);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        console.log('Setting preview URL:', previewUrl);
        setPreview(previewUrl);
      };
      reader.readAsDataURL(file);
      
      // Upload file
      console.log('Starting avatar upload...');
      const result = await uploadAvatar(file);
      
      if (result) {
        console.log('Avatar upload successful:', result);
      } else {
        console.log('Avatar upload failed');
        setPreview(null); // Clear preview on failure
      }
    } catch (error) {
      console.error('Error in handleFileChange:', error);
      setPreview(null); // Clear preview on error
    }
  };
  
  const avatarUrl = getAvatarUrl();
  console.log('Current avatar URL in wrapper:', avatarUrl);
  
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <AvatarDisplay 
        avatarUrl={avatarUrl}
        username={profile?.username}
        size={size}
        isLoading={uploading}
      />
      
      <input 
        id="avatar-upload" 
        type="file" 
        accept="image/*" 
        className="sr-only" 
        onChange={handleFileChange}
        disabled={uploading}
      />
      
      <UploadProgress isUploading={uploading} />
      
      <Button 
        variant="outline" 
        size="sm" 
        asChild 
        className="mt-2 h-10 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
        disabled={uploading}
      >
        <label htmlFor="avatar-upload">
          {avatarUrl ? 'Change Photo' : 'Upload Photo'}
        </label>
      </Button>
    </div>
  );
};
