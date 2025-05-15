
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import { uploadFavicon } from '@/lib/seo';

const FaviconUploader: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
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
      
      // Check file type - prefer SVG or PNG with transparency
      const fileType = file.type;
      if (!['image/svg+xml', 'image/png'].includes(fileType)) {
        toast({
          title: 'Warning',
          description: 'For best results, use SVG or PNG with transparency',
          variant: 'warning'
        });
      }
      
      // Upload through our SEO service
      const { url, error } = await uploadFavicon(file);
      
      if (error) {
        throw error;
      }
      
      if (url) {
        setFaviconUrl(url);
        toast({
          title: 'Favicon updated',
          description: 'Your favicon has been uploaded successfully'
        });
        
        // Update the favicon in the document head
        const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (faviconLink) {
          faviconLink.href = url;
          faviconLink.type = fileType;
        }
      }
    } catch (error: any) {
      console.error('Error uploading favicon:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'There was a problem uploading your favicon',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Favicon Uploader</CardTitle>
        <CardDescription>
          Upload a transparent favicon (SVG or PNG recommended)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className="border-2 border-dashed rounded-md p-6 cursor-pointer hover:border-black transition-colors flex flex-col items-center justify-center"
          onClick={() => fileInputRef.current?.click()}
        >
          {faviconUrl ? (
            <div className="flex flex-col items-center">
              <img 
                src={faviconUrl} 
                alt="Current favicon" 
                className="w-16 h-16 mb-2 bg-gray-100 p-1 rounded" 
              />
              <p className="text-sm text-gray-600">Click to upload a new favicon</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm">Click to upload a favicon</p>
              <p className="text-xs text-gray-500 mt-1">SVG or PNG with transparency recommended</p>
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden"
          accept=".svg,.png" 
          onChange={handleFileSelect}
        />
        
        {uploading && (
          <div className="mt-4 text-center">
            <p className="text-sm">Uploading favicon...</p>
          </div>
        )}
        
        {faviconUrl && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-xs font-medium">Favicon URL:</p>
            <code className="text-xs block mt-1 overflow-x-auto p-2 bg-white border rounded">
              {faviconUrl}
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FaviconUploader;
