
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleToggleMode = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-25 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Sign in to your account
          </h1>
          <p className="text-lg auth-subtext">
            Ready to find your next adventure?
          </p>
          <div className="flex justify-center items-center gap-4 text-xl opacity-60 mt-4">
            <span>🌊</span>
            <span>🎯</span>
            <span>✨</span>
          </div>
        </div>

        <Card className="auth-container border-0 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="auth-heading text-2xl">Sign In</CardTitle>
            <CardDescription className="auth-subtext">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm 
              onToggleMode={handleToggleMode}
              onForgotPassword={handleForgotPassword}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
