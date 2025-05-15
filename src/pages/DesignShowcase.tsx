
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DesignShowcase = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new design system page
    navigate('/design-system');
  }, [navigate]);
  
  return (
    <div className="container py-8">
      <p>Redirecting to design system...</p>
    </div>
  );
};

export default DesignShowcase;
