
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface AuthOverlayProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ 
  children, 
  title = "Sign in required",
  description = "You need to be logged in to access this page."
}) => {
  return (
    <div className="relative">
      {/* Greyed out content */}
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
      
      {/* Overlay with login prompt */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <Card className="w-full max-w-md mx-4 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
            <CardDescription className="text-base">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/signup">Create Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
