
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const LandingCtaSection: React.FC = () => (
  <section className="py-16 gradient-ocean">
    <div className="container mx-auto px-2 sm:px-4 text-center">
      <h2 className="text-3xl font-semibold tracking-tight mb-4 text-white">
        Ready to Find Your Next <span className="text-handwritten text-sunset-yellow">Adventure?</span>
      </h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
        Join our community and start discovering events that match your interests and vibe.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild variant="default" size="lg" className="btn-sunset text-white font-medium">
          <Link to="/events">
            Explore Events
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-2 border-white/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
          <Link to="/profile">
            Create Profile
          </Link>
        </Button>
      </div>
    </div>
  </section>
);
