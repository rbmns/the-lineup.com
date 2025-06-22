
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SignupForm from '@/components/auth/SignupForm';

const Signup = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-25 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Join the <span className="text-vibrant-seafoam">community</span>
          </h1>
          <p className="text-lg text-neutral">
            Discover events that match your vibe
          </p>
          <div className="flex justify-center items-center gap-4 text-xl opacity-60 mt-4">
            <span>🎨</span>
            <span>🏖️</span>
            <span>🎶</span>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-primary">
              Create an Account
            </CardTitle>
            <CardDescription className="text-neutral">
              Join us to discover events and connect with your community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignupForm onToggleMode={() => navigate('/login')} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
