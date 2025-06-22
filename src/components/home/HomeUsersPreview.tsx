
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Heart } from 'lucide-react';

export const HomeUsersPreview: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-primary mb-4">
            Connect with Fellow Adventurers
          </h2>
          <p className="text-lg text-neutral max-w-2xl mx-auto">
            Build your community. Make new friends. Share experiences together.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">Find Friends</h3>
            <p className="text-neutral">
              Discover people who share your interests and join events together
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">Grow Your Network</h3>
            <p className="text-neutral">
              Connect with locals and fellow travelers in every destination
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">Share Experiences</h3>
            <p className="text-neutral">
              Create lasting memories and friendships through shared adventures
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/friends">
            <Button size="lg">
              Explore Community
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
