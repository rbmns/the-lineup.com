
import React from 'react';
import { Search, Calendar, Users } from 'lucide-react';

export const HowItWorksSection: React.FC = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-2 sm:px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold tracking-tight mb-4">How The Lineup Works</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover, connect, and experience amazing events in your area with just a few taps.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Discover Events</h3>
          <p className="text-gray-600">
            Browse events happening near you, from yoga sessions to beach parties and everything in between.
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">RSVP & Plan</h3>
          <p className="text-gray-600">
            Show interest or commit to going. Keep track of your plans and never miss out on what matters to you.
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Connect & Enjoy</h3>
          <p className="text-gray-600">
            Meet like-minded people at events and build meaningful connections in your community.
          </p>
        </div>
      </div>
    </div>
  </section>
);
