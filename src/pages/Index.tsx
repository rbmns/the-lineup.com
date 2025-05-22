
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  // Use useEffect for navigation instead of Navigate component
  useEffect(() => {
    // Short timeout to allow any initial renders to complete
    const redirectTimeout = setTimeout(() => {
      navigate('/home', { replace: true });
    }, 200);
    
    return () => clearTimeout(redirectTimeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6 tracking-tight">Welcome to The Lineup</h1>
      <div className="text-center max-w-md mb-8">
        <p className="text-xl text-muted-foreground leading-relaxed mb-6">
          You'll be redirected to the home page shortly...
        </p>
        <div className="flex space-x-4 justify-center">
          <Button asChild>
            <Link to="/home">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/events">Browse Events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
