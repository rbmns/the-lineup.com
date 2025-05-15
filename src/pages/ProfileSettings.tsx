
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect in the effect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          This is where you can update your profile settings and preferences.
        </p>
      </div>
    </div>
  );
};

export default ProfileSettings;
