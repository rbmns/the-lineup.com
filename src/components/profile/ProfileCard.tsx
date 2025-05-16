import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToUserProfile } from '@/utils/navigationUtils';

interface ProfileCardProps {
  // Add your props here
  userId: string;
  // Add other props
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userId, /* other props */ }) => {
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    // This should be calling navigateToUserProfile with 2 arguments, not 4
    navigateToUserProfile(navigate, userId);
  };
  
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default ProfileCard;
