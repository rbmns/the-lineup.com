
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const FaviconUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image and has appropriate size
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Check if file size is under 1MB
    if (file.size > 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Favicon should be under 1MB",
        variant: "destructive", // Changed from "warning" to "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('site-assets')
        .upload(`favicon-${Date.now()}.${file.name.split('.').pop()}`, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            setProgress(Math.round((progress.loaded / progress.total) * 100));
          }
        });
        
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('site-assets')
        .getPublicUrl(data.path);
        
      // Save to site settings
      const { error: settingsError } = await supabase
        .from('site_settings')
        .update({ favicon_url: publicUrlData.publicUrl })
        .eq('id', 1);
        
      if (settingsError) throw settingsError;
      
      toast({
        title: "Favicon updated",
        description: "The site favicon has been updated",
        variant: "default",
      });
        
    } catch (error: any) {
      console.error('Error uploading favicon:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload favicon",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="file"
          id="favicon-upload"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('favicon-upload')?.click()}
          disabled={isUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Favicon
        </Button>
        {isUploading && <span className="text-sm text-gray-500">{progress}%</span>}
      </div>
      <p className="text-sm text-gray-500">
        Upload a square image (ideally 32x32 or 64x64) that will be used as the site favicon
      </p>
    </div>
  );
};

export default FaviconUploader;
