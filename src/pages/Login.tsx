import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
const Login = () => {
  const {
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', {
        replace: true
      });
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
  return <div className="min-h-screen bg-sand flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Welcome Header - Reduced spacing */}
        <div className="text-center mb-6">
          
          
          
        </div>

        <Card className="card-base">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-ocean-deep mb-2">Sign In</CardTitle>
            <CardDescription className="text-sm text-graphite-grey/80">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <LoginForm onToggleMode={handleToggleMode} onForgotPassword={handleForgotPassword} />
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Login;