
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const GoodbyePage: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const logoutAndRedirect = async () => {
      try {
        console.log('Starting logout process');
        await signOut();
        console.log('Logout successful, redirecting to login');
        setTimeout(() => navigate('/login'), 1500);
      } catch (error) {
        console.error('Logout error:', error);
        // Even if there's an error, redirect to login
        setTimeout(() => navigate('/login'), 1500);
      }
    };

    logoutAndRedirect();
  }, [signOut, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Goodbye!</h1>
      <p className="text-gray-600 mb-6">You are now being logged out...</p>
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple" />
      </div>
    </div>
  );
};

export default GoodbyePage;
