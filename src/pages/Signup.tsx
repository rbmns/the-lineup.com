
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SignupForm from '@/components/auth/SignupForm';

const Signup = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Welcome Header - Reduced spacing */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-display text-ocean-deep mb-4">
            Create an Account
          </h1>
          <p className="text-sm sm:text-base text-graphite-grey mb-3">
            Join us to discover events and connect with your community
          </p>
          <div className="flex justify-center items-center gap-3 text-lg opacity-60">
            <span>🎨</span>
            <span>🏖️</span>
            <span>🎶</span>
          </div>
        </div>

        <Card className="card-base">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-ocean-deep mb-2">
              Get Started
            </CardTitle>
            <CardDescription className="text-sm text-graphite-grey/80">
              Create your account to start discovering amazing events
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <SignupForm onToggleMode={() => navigate('/login')} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
