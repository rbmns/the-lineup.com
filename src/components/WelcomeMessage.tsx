import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const WelcomeMessage = () => {
  return (
    <Card className="max-w-md mx-auto mb-8 shadow-xl border border-gray-100 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden animate-fade-in">
      <CardContent className="space-y-4 p-6">
        <div className="text-center mb-4">
          <img 
            src="https://res.cloudinary.com/dita7stkt/image/upload/v1746861996/icon_transp2_zsptuk.svg" 
            alt="the lineup logo" 
            className="h-12 w-auto mx-auto mb-2 animate-scale-in"
          />
          <h2 className="text-2xl font-sans font-bold mt-2 text-black">the-lineup</h2>
        </div>
        
        <h2 className="text-xl font-sans font-bold text-center text-black animate-fade-in">Welcome to The Lineup</h2>
        <p className="text-gray-700 text-center animate-fade-in">
          Join the flow and discover local events, connect with people around you, and make the most of your experiences.
        </p>
        <div className="flex justify-center">
          <Button asChild variant="dark">
            <Link to="/profile/edit">Complete Your Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
