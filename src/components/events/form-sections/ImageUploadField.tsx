import React, { useState, useCallback } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export const ImageUploadField: React.FC = () => {
  const form = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleRemoveImage = () => {
    form.setValue('imageUrl', '');
    setPreviewUrl(null);
    setUploadError(null);
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
              {/* Upload Area */}
              {!imageUrl && !previewUrl && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
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
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {isUploading ? 'Uploading...' : 'Click to upload an image'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 5MB
                    </span>
                  </label>
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