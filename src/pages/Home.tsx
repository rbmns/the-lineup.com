
import React from 'react';
import { Helmet } from 'react-helmet-async';

const Home: React.FC = () => {
  return (
    <div className="w-full bg-gray-50">
      <Helmet>
        <title>the lineup</title>
        <meta name="description" content="Discover and join events in your area" />
      </Helmet>
      
      {/* Full-width hero section */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="w-full py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Welcome to the lineup
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Discover amazing events, connect with friends, and create unforgettable experiences.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-semibold mb-4">Discover Events</h3>
              <p className="text-base leading-7 text-muted-foreground">
                Find exciting events happening around you, from concerts to workshops and everything in between.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-semibold mb-4">Connect with Friends</h3>
              <p className="text-base leading-7 text-muted-foreground">
                See what your friends are up to and join them at events you'll all love.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-semibold mb-4">Create Plans</h3>
              <p className="text-base leading-7 text-muted-foreground">
                Organize your own casual plans and invite others to join you for fun activities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
