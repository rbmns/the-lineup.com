
import React from 'react';

interface UploadProgressProps {
  isUploading: boolean;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ isUploading }) => {
  if (!isUploading) return null;

  return (
    <div className="w-full max-w-xs animate-scale-in">
      <div className="bg-gray-200 rounded-full h-1.5 mb-2">
        <div
          className="bg-black h-1.5 rounded-full transition-all duration-300"
          style={{ width: '100%' }}
        />
      </div>
      <p className="text-sm text-gray-500 text-center">Uploading...</p>
    </div>
  );
};
