
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCanonical } from '@/hooks/useCanonical';
import { defaultSeoTags } from '@/utils/seoUtils';

const Index = () => {
  const navigate = useNavigate();
  
  // Set canonical URL for the homepage
  useCanonical('/', defaultSeoTags.title);
  
  // Automatically redirect to events page
  useEffect(() => {
    navigate('/events', { replace: true });
  }, [navigate]);
  
  return null; // No need for any content since we're redirecting
};

export default Index;
