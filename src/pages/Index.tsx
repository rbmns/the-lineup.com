
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Simple redirect component using Navigate
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6 tracking-tight">Welcome to Events</h1>
      <div className="text-center max-w-md mb-8">
        <p className="text-xl text-muted-foreground leading-relaxed mb-6">
          You'll be redirected to the events page shortly...
        </p>
        <div className="flex space-x-4 justify-center">
          <Button asChild>
            <Link to="/events">Go to Events</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/design-system">View Design System</Link>
          </Button>
        </div>
      </div>
      
      {/* Use Navigate component for redirection instead of useEffect */}
      <Navigate to="/events" replace />
    </div>
  );
};

export default Index;
