
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useNavigate, Link } from 'react-router-dom';

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  
  // Determine if viewing own profile
  const isOwnProfile = !userId || userId === user?.id;
  
  // Redirect to login if trying to view own profile but not logged in
  React.useEffect(() => {
    if (isOwnProfile && !user) {
      navigate('/login');
    }
  }, [isOwnProfile, user, navigate]);

  if (isOwnProfile && !user) {
    return null; // Will redirect in effect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isOwnProfile ? 'My Profile' : 'User Profile'}
      </h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        {isOwnProfile && (
          <div className="mb-4">
            <Link 
              to="/profile/settings" 
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Edit Profile Settings
            </Link>
          </div>
        )}
        
        <div className="space-y-4">
          <p className="text-gray-600">
            {isOwnProfile 
              ? 'This is your profile page where you can view your information.' 
              : `This is the profile page for user ${userId}.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
