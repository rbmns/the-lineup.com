import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface AuthOverlayProps {
  title: string;
  description: string;
  children: React.ReactNode;
  browseEventsButton?: boolean;
  onClose?: () => void; // to dismiss overlay
  onBrowseEvents?: () => void; // callback for browse events
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({
  title,
  description,
  children,
  browseEventsButton = false,
  onClose,
  onBrowseEvents
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Background content - greyed out and non-interactive */}
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md mx-auto bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
            <CardDescription className="text-base text-gray-600">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full bg-black text-white hover:bg-gray-800 text-base font-semibold py-3"
            >
              Log In
            </Button>
            <Button 
              onClick={() => navigate('/signup')} 
              variant="outline"
              className="w-full text-black border-gray-300 hover:bg-gray-50 text-base font-semibold py-3"
            >
              Sign Up
            </Button>
            {browseEventsButton && (
              <Button 
                onClick={onBrowseEvents}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-800 text-base py-3"
              >
                Just Browse Events
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
