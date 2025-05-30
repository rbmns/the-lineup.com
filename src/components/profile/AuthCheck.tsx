
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export const AuthCheck: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
        <p className="text-gray-600 mb-6">
          Please log in to view this profile.
        </p>
        <Button onClick={() => navigate('/login')}>
          Log In
        </Button>
      </div>
    </div>
  );
};
