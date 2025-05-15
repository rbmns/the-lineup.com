
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { safeGoBack } from '@/utils/navigationUtils';

interface BackButtonProps {
  className?: string;
  defaultPath?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  className = '', 
  defaultPath = '/events' 
}) => {
  const navigate = useNavigate();

  const handleBackNavigation = () => {
    try {
      // Use our safer back navigation utility
      safeGoBack(navigate, defaultPath);
      console.log("Back navigation triggered");
    } catch (err) {
      console.error("Navigation error going back:", err);
      navigate(defaultPath);
    }
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleBackNavigation}
      className={className}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  );
};
