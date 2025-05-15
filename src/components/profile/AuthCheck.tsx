
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const AuthCheck = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-8">
      <Card className="p-8 text-center">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <p className="text-gray-500 mb-4">You need to be logged in to view your profile.</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </CardContent>
      </Card>
    </div>
  );
};
