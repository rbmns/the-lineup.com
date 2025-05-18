
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCanonical } from '@/hooks/useCanonical';
import { defaultSeoTags } from '@/utils/seoUtils';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  
  // Set canonical URL for the homepage
  useCanonical('/', defaultSeoTags.title);
  
  // Automatically redirect to events page
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/events', { replace: true });
    }, 2000); // Wait 2 seconds before redirecting
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6 tracking-tight">Welcome to Events</h1>
      <div className="text-center max-w-md mb-8">
        <p className="text-xl text-muted-foreground leading-relaxed mb-6">
          You'll be redirected to the events page shortly...
        </p>
        <div className="flex space-x-4 justify-center">
          <Button onClick={() => navigate('/events')}>
            Go to Events
          </Button>
          <Button variant="outline" asChild>
            <Link to="/design-system">View Design System</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
