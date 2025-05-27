
import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from 'lucide-react';
import { processImageUrls } from '@/utils/imageUtils';

const AvatarUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { user, profile, refreshProfile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.warn("No file selected");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("File upload error:", uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const newAvatarUrl = urlData.publicUrl;
      setAvatarUrl(newAvatarUrl);

      const success = await updateAvatarInProfile(newAvatarUrl);
      if (success) {
        await refreshProfile();
      }
    } catch (error: any) {
      console.error("Avatar upload failed:", error);
      toast({
        description: error.message || "Failed to upload your avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const updateAvatarInProfile = async (avatarUrl: string) => {
    try {
      if (!user?.id) {
        throw new Error("User not logged in");
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: [avatarUrl] }) // Store as array
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        description: "Your profile picture has been updated."
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating avatar in profile:", error);
      
      toast({
        description: error.message || "Failed to update your avatar in your profile.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const triggerFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Get avatar URL from profile using processImageUrls
  const displayAvatarUrl = (() => {
    if (avatarUrl) return avatarUrl;
    const profileUrls = processImageUrls(profile?.avatar_url);
    return profileUrls.length > 0 ? profileUrls[0] : `https://avatar.vercel.sh/${profile?.username}.png`;
  })();

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={displayAvatarUrl} alt="Avatar" />
        <AvatarFallback>{profile?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="space-y-2 text-center">
        <p className="text-sm text-gray-500">
          Update your profile picture
        </p>
        
        <Button 
          variant="outline" 
          onClick={triggerFileInput}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Choose an image"
          )}
        </Button>
        
        <Input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
          ref={inputRef}
        />
      </div>
    </div>
  );
};

export default AvatarUpload;
