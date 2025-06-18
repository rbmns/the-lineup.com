
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SignupForm from '@/components/auth/SignupForm';

const Signup = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-xl py-8 animate-fade-in">
      <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-2xl font-semibold">
            Create an Account
          </CardTitle>
          <CardDescription>
            Sign up to access all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignupForm onToggleMode={() => navigate('/login')} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
