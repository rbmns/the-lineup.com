
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';

export const OrganizerCtaSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { canCreateEvents, isLoading } = useCreatorStatus();

  if (isLoading) {
    return null; // Don't show anything while loading
  }

  const getButtonText = () => {
    if (!isAuthenticated) {
      return 'Sign Up as Event Organizer';
    }
    if (canCreateEvents) {
      return 'Go to Dashboard';
    }
    return 'Request Organizer Access';
  };

  const getButtonLink = () => {
    if (!isAuthenticated) {
      return '/signup';
    }
    return '/organise';
  };

  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold mb-3 text-gray-900">Are you organising events or giving classes?</h3>
          <p className="text-lg text-gray-600 mb-6">Sign up to create events or send your event calendar to events@the-lineup.com</p>
          
          <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
            <Link to={getButtonLink()}>
              {getButtonText()}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
