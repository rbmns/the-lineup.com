
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { toast } from 'sonner';
import { completeLogout, clearAllRateLimits } from '@/integrations/supabase/client';

interface LocationState {
  initialMode?: 'login' | 'register';
}

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { isAuthenticated, user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Clear any stale session when mounting the login page
    const clearSession = async () => {
      if (!isAuthenticated && !loading) {
        await completeLogout();
        // Also clear all rate limit data when coming to login page
        clearAllRateLimits();
      }
    };

    clearSession();
  }, []);

  useEffect(() => {
    // Check for hash param #error_description to show any auth error
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const errorDescription = hashParams.get('error_description');
    
    if (errorDescription) {
      toast.error("Auth Error", {
        description: decodeURIComponent(errorDescription)
      });
      
      // Clear the URL hash
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    // Only redirect if loading is complete and user is authenticated
    if (!loading && isAuthenticated && user) {      
      // If the user is new, send them to the profile edit page
      if (isNewUser) {
        navigate('/profile/edit');
      } else {
        navigate('/profile');
      }
    }
    
    // Check if we should start in register mode (from the Register button)
    if (state?.initialMode === 'register') {
      setIsLogin(false);
    }
  }, [isAuthenticated, user, navigate, state, loading, isNewUser]);

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
  };

  const getTitle = () => {
    if (isForgotPassword) return 'Reset Password';
    return isLogin ? 'Login' : 'Sign Up';
  };

  const getDescription = () => {
    if (isForgotPassword) return 'Enter your email to receive a password reset link';
    return isLogin ? 'Enter your credentials to access your account' : 'Create a new account';
  };

  if (loading) {
    return (
      <div className="container max-w-xl py-8 animate-fade-in">
        <Card className="border border-gray-200 shadow-md">
          <CardHeader className="flex flex-col items-center">
            <CardTitle className="text-2xl font-semibold">Loading</CardTitle>
            <CardDescription>
              Please wait while we check your authentication status...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-xl py-8 animate-fade-in">
      <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-2xl font-semibold">
            {getTitle()}
          </CardTitle>
          <CardDescription>
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isForgotPassword ? (
            <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
          ) : isLogin ? (
            <LoginForm onToggleMode={handleToggleMode} onForgotPassword={handleForgotPassword} />
          ) : (
            <SignupForm onToggleMode={handleToggleMode} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
