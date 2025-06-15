
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const LandingCtaSection: React.FC = () => (
  <section className="py-16 bg-secondary">
    <div className="container mx-auto px-2 sm:px-4 text-center">
      <h2 className="text-3xl tracking-tight mb-4 text-foreground">
        Ready to Find Your Next Adventure?
      </h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
        Join our community and start discovering events that match your interests and vibe.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild variant="primary" size="lg">
          <Link to="/events">
            Explore Events
          </Link>
        </Button>
        <Button asChild variant="default" size="lg">
          <Link to="/profile">
            Create Profile
          </Link>
        </Button>
      </div>
    </div>
  </section>
);
