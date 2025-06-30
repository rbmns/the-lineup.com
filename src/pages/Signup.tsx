
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SignupForm from '@/components/auth/SignupForm';

const Signup = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-sand flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-h2 font-display text-ocean-deep mb-6">
            Create an Account
          </h1>
          <p className="text-body-base text-graphite-grey mb-4">
            Join us to discover events and connect with your community
          </p>
          <div className="flex justify-center items-center gap-4 text-xl opacity-60">
            <span>🎨</span>
            <span>🏖️</span>
            <span>🎶</span>
          </div>
        </div>

        <Card className="card-base">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-h4 text-ocean-deep mb-2">
              Get Started
            </CardTitle>
            <CardDescription className="text-body-small text-graphite-grey/80">
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
