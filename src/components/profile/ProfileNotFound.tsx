
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserX } from 'lucide-react';

interface ProfileNotFoundProps {
  error?: string;
}

export const ProfileNotFound: React.FC<ProfileNotFoundProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <UserX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
        <p className="text-gray-600 mb-6">
          {error || "The profile you're looking for doesn't exist or you don't have permission to view it."}
        </p>
        <Button onClick={() => navigate('/friends')} variant="outline">
          Back to Friends
        </Button>
      </div>
    </div>
  );
};
