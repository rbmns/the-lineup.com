import React, { useState, useCallback } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Upload, Link } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export const ImageUploadField: React.FC = () => {
  const form = useFormContext();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Image must be smaller than 5MB');
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('events')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('events')
        .getPublicUrl(fileName);

      // Update form
      form.setValue('imageUrl', publicUrl);
      setPreviewUrl(publicUrl);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [form]);

  const handleUrlSubmit = useCallback((url: string) => {
    if (!url.trim()) return;
    
    // Basic URL validation
    try {
      new URL(url);
      form.setValue('imageUrl', url);
      setPreviewUrl(url);
      setShowUrlInput(false);
      setUploadError(null);
    } catch {
      setUploadError('Please enter a valid image URL');
    }
  }, [form]);

  const handleRemoveImage = () => {
    form.setValue('imageUrl', '');
    setPreviewUrl(null);
    setUploadError(null);
    setShowUrlInput(false);
  };

  const imageUrl = form.watch('imageUrl');

  return (
    <FormField
      control={form.control}
      name="imageUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event Image (Optional)</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {/* Upload Options */}
              {!imageUrl && !previewUrl && !showUrlInput && (
                <div className="space-y-3">
                  {/* File Upload - Only for authenticated users */}
                  {user && (
                    <div className="border-2 border-dashed border-mist-grey rounded-lg p-6 text-center hover:border-ocean-teal/30 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file);
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploading}
                      />
                      <label 
                        htmlFor="image-upload" 
                        className={cn(
                          "cursor-pointer flex flex-col items-center",
                          isUploading && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <Upload className="h-8 w-8 text-ocean-teal mb-2" />
                        <span className="text-sm text-graphite-grey">
                          {isUploading ? 'Uploading...' : 'Click to upload an image'}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 5MB
                        </span>
                      </label>
                    </div>
                  )}
                  
                  {/* URL Input Option */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUrlInput(true)}
                      className="border-ocean-teal/30 hover:border-ocean-teal text-ocean-teal hover:bg-ocean-teal/10"
                    >
                      <Link className="h-4 w-4 mr-2" />
                      {user ? 'Or add image URL' : 'Add image from URL'}
                    </Button>
                  </div>
                </div>
              )}

              {/* URL Input */}
              {showUrlInput && !imageUrl && !previewUrl && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleUrlSubmit((e.target as HTMLInputElement).value);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                        if (input) {
                          handleUrlSubmit(input.value);
                        }
                      }}
                      className="bg-ocean-teal hover:bg-ocean-teal/90"
                    >
                      Add
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUrlInput(false)}
                    className="w-full text-muted-foreground hover:text-graphite-grey"
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {/* Preview */}
              {(imageUrl || previewUrl) && (
                <div className="relative">
                  <img 
                    src={previewUrl || imageUrl} 
                    alt="Event preview" 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                </div>
              )}

              {/* Error Display */}
              {uploadError && (
                <Alert variant="destructive">
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};