
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import UserProfilePage from './UserProfilePage';
import { Loader2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If no user, redirect to login
  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [user, navigate]);
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Use the UserProfilePage component for the current user
  return <UserProfilePage hideTitle={true} />;
};

export default Profile;
