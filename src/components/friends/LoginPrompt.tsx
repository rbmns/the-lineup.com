
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginPrompt = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-8">
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in</h1>
        <p className="text-gray-500 mb-4">You need to be logged in to view your friends.</p>
        <button 
          className="bg-purple hover:bg-purple/90 text-white px-4 py-2 rounded"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};
