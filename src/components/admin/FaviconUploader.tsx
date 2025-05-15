import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface FaviconUploaderProps {
  currentFaviconUrl: string | null;
  onUploadComplete: (newFaviconUrl: string) => void;
}

const FaviconUploader: React.FC<FaviconUploaderProps> = ({ currentFaviconUrl, onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<ProgressEvent | null>(null);
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/x-icon': ['.ico'],
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]);
    }
  });

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a favicon file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(null);

    const filePath = `favicons/favicon_${Date.now()}.${file.name.split('.').pop()}`;

    try {
      const { data, error } = await supabase.storage.from('public')
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading favicon:", error);
        toast({
          title: "Upload failed",
          description: "There was an error uploading the favicon. Please try again.",
          variant: "destructive",
        });
      } else {
        const newFaviconUrl = `${supabase.storageUrl}/public/${data.path}`;
        onUploadComplete(newFaviconUrl);
        toast({
          title: "Upload successful",
          description: "Favicon uploaded successfully!",
          variant: "success",
        });
      }
    } catch (err) {
      console.error("Unexpected error during upload:", err);
      toast({
        title: "Unexpected error",
        description: "An unexpected error occurred during the upload process.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div {...getRootProps()} className="relative border-2 border-dashed rounded-md cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
        <Input {...getInputProps()} id="favicon-upload" className="hidden" />
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Drag 'n' drop your favicon here, or click to select files
          </p>
          <p className="text-xs text-gray-400 mt-1">
            (Only *.png, *.jpeg, *.jpg and *.ico images will be accepted)
          </p>
        </div>
      </div>
      {file && (
        <aside className="mt-4 flex items-center space-x-2">
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded Favicon Preview"
            className="h-10 w-10 rounded-sm"
          />
          <p className="text-sm text-gray-700">{file.name} - {file.size} bytes</p>
        </aside>
      )}
      <Button onClick={handleUpload} disabled={uploading} className="mt-4">
        {uploading ? 'Uploading...' : 'Upload Favicon'}
      </Button>
      {uploadProgress && (
        <progress value={uploadProgress.loaded} max={uploadProgress.total} />
      )}
      {currentFaviconUrl && (
        <div className="mt-4">
          <Label>Current Favicon:</Label>
          <img src={currentFaviconUrl} alt="Current Favicon" className="h-10 w-10 rounded-sm" />
        </div>
      )}
    </div>
  );
};

export default FaviconUploader;
