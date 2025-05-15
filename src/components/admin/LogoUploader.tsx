
import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Upload, Check, AlertCircle } from 'lucide-react';

const LogoUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    await handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setProgress(10);
      
      // Ensure the branding bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const brandingBucket = buckets?.find(b => b.name === 'branding');
      
      if (!brandingBucket) {
        console.log('Creating branding bucket...');
        const { error } = await supabase.storage.createBucket('branding', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2 MB
        });
        
        if (error) {
          throw error;
        }
      }
      
      setProgress(30);
      
      // Upload the logo file
      const filePath = '/logo.png';
      const { error: uploadError } = await supabase.storage
        .from('branding')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      setProgress(70);
      
      // Get the public URL
      const { data } = supabase.storage
        .from('branding')
        .getPublicUrl(filePath);
        
      setLogoUrl(data.publicUrl);
      
      // Add a timestamp to bust the cache
      const cachedUrl = `${data.publicUrl}?t=${Date.now()}`;
      
      toast({
        title: "Logo uploaded successfully!",
        description: "Your logo has been uploaded and is now available to use.",
      });
      
      setProgress(100);
      
      // Add info on how to use the logo
      console.log('Logo URL for use in components:', cachedUrl);
      
      setTimeout(() => {
        setProgress(0);
      }, 2000);
      
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading your logo.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="border border-gray-200 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Logo Uploader</CardTitle>
        <CardDescription>
          Upload your company logo to use throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-gray-200 hover:border-gray-300 transition-all cursor-pointer" onClick={triggerFileSelect}>
          {logoUrl ? (
            <div className="flex flex-col items-center">
              <img 
                src={logoUrl} 
                alt="Uploaded logo" 
                className="max-h-32 mb-4" 
              />
              <p className="text-sm text-gray-500 mt-2">Click to replace</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-gray-400 mb-4" />
              <p className="text-sm font-medium">Click to upload your logo</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG or SVG (max. 2MB)</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="bg-gray-200 h-2 rounded-full">
              <div 
                className="bg-black h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1 text-gray-500">Uploading: {progress}%</p>
          </div>
        )}
        
        {logoUrl && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center"><Check className="h-4 w-4 mr-1 text-green-500" /> Logo Uploaded</h4>
            <div className="bg-black bg-opacity-5 p-3 rounded text-sm font-mono overflow-x-auto">
              <p className="text-gray-700">{logoUrl}</p>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              <AlertCircle className="h-3 w-3 inline mr-1" /> 
              This URL can be used in your <code>BrandLogo.tsx</code> component to display your logo.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <p className="text-xs text-gray-500">
          After uploading, the logo will be available at the above URL
        </p>
      </CardFooter>
    </Card>
  );
};

export default LogoUploader;
