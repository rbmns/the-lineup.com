
import React from 'react';
import { Loader2 } from 'lucide-react';

interface UploadProgressProps {
  isUploading: boolean;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ isUploading }) => {
  if (!isUploading) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Uploading...</span>
    </div>
  );
};
