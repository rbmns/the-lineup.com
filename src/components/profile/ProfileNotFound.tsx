
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserX } from 'lucide-react';

export const ProfileNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12 px-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 p-4 rounded-full">
          <UserX size={48} className="text-gray-400" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Profile Not Found</h2>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        The user profile you're looking for doesn't exist or you may not have permission to view it.
      </p>
      <div className="flex justify-center space-x-3">
        <Button variant="outline" onClick={() => navigate('/friends')}>
          View Friends
        </Button>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Home
        </Button>
      </div>
    </div>
  );
};
