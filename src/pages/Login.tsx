
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
    <div className="min-h-screen bg-sand flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-h2 font-display text-ocean-deep mb-6">
            Welcome Back
          </h1>
          <p className="text-body-base text-graphite-grey mb-4">
            Sign in to your account to continue
          </p>
          <div className="flex justify-center items-center gap-4 text-xl opacity-60">
            <span>🌊</span>
            <span>🎯</span>
            <span>✨</span>
          </div>
        </div>

        <Card className="card-base">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-h4 text-ocean-deep mb-2">Sign In</CardTitle>
            <CardDescription className="text-body-small text-graphite-grey/80">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
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
