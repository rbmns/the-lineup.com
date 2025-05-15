
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useProfileData } from '@/hooks/useProfileData';
import { AvatarUploadWrapper } from '@/components/profile/AvatarUploadWrapper';

const WELCOME_MESSAGE_SHOWN = 'welcome_message_shown';

const ProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, loading, error, updateProfile, refreshProfile } = useProfileData(user?.id);
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    // Show welcome message only for users who haven't set their location
    if (profile && !profile.location) {
      setShowWelcome(true);
    }
  }, [profile]);

  const handleSubmit = async (formData: any) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await updateProfile(formData);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Navigate to profile with state to indicate a refresh is needed
      navigate('/profile', { 
        replace: true,
        state: { refreshNeeded: true }
      });
      
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          {showWelcome && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md shadow-sm">
              <h2 className="text-xl font-bold text-blue-700">Complete your profile</h2>
              <p className="mt-2 text-blue-600">
                Please set your location to discover nearby events and connect with friends in your area.
              </p>
            </div>
          )}
          
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
              <AvatarUploadWrapper className="w-32 h-32" />
            </div>

            <Separator className="my-6" />
            
            <ProfileForm 
              profile={profile} 
              onSubmit={handleSubmit}
              onCancel={handleCancel} 
              showRequiredFields={showWelcome}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
