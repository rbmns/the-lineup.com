
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Music, Beach, Utensils, Sports } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container px-4 mx-auto">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Discover What's Happening Around You.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            The-Lineup.com helps you find the best local events — from markets and music to wellness and beach vibes.
            Check who's going, plan your day, or just show up.
            Social or solo, you're in the right place.
          </p>
          <Button asChild size="lg" className="bg-black hover:bg-black/90 text-white font-inter px-6">
            <Link to={isAuthenticated ? "/events" : "/signup"}>
              Start Exploring – Sign Up Free
            </Link>
          </Button>
        </div>
      </section>

      <hr className="border-t border-gray-200 my-16" />

      {/* Why People Use The Lineup */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">Why People Use The Lineup</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-2xl">🗓️</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Search local events</h3>
                <p className="text-muted-foreground">Find events by type, date, and vibe</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-2xl">📍</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">See what's near you</h3>
                <p className="text-muted-foreground">Real-time events in your area</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-2xl">👀</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Check who's going</h3>
                <p className="text-muted-foreground">If you want to know who'll be there</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-2xl">👤</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create a profile</h3>
                <p className="text-muted-foreground">Join the social side — or stay low-key</p>
              </div>
            </div>
          </div>
          
          <p className="text-center mt-10 text-lg">
            Just want to browse events? Go for it.<br />
            Want to meet people while you're at it? Even better.
          </p>
        </div>
      </section>
      
      <hr className="border-t border-gray-200 my-16" />

      {/* Featured Event Types */}
      <section className="py-16 bg-gray-50 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">Featured Event Types</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="flex flex-col items-center p-4 hover:bg-white rounded-lg transition-colors">
              <Music size={40} strokeWidth={1.5} className="text-purple-600 mb-3" />
              <span className="font-medium">Music &<br />Festivals</span>
            </div>
            
            <div className="flex flex-col items-center p-4 hover:bg-white rounded-lg transition-colors">
              <Beach size={40} strokeWidth={1.5} className="text-blue-500 mb-3" />
              <span className="font-medium">Beach &<br />Wellness</span>
            </div>
            
            <div className="flex flex-col items-center p-4 hover:bg-white rounded-lg transition-colors">
              <Utensils size={40} strokeWidth={1.5} className="text-orange-500 mb-3" />
              <span className="font-medium">Food Trucks &<br />Pop-ups</span>
            </div>
            
            <div className="flex flex-col items-center p-4 hover:bg-white rounded-lg transition-colors">
              <Sports size={40} strokeWidth={1.5} className="text-green-500 mb-3" />
              <span className="font-medium">Sports &<br />Games</span>
            </div>
            
            <div className="flex flex-col items-center p-4 hover:bg-white rounded-lg transition-colors">
              <Calendar size={40} strokeWidth={1.5} className="text-red-500 mb-3" />
              <span className="font-medium">Arts, Culture &<br />Community</span>
            </div>
          </div>
          
          <p className="text-center mt-10 text-lg">
            No random listings. Just the good stuff.
          </p>
        </div>
      </section>

      <hr className="border-t border-gray-200 my-16" />

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 font-bold text-xl mb-4">1</div>
              <h3 className="text-xl font-medium mb-2">Browse events near you</h3>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 font-bold text-xl mb-4">2</div>
              <h3 className="text-xl font-medium mb-2">See event details and location</h3>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 font-bold text-xl mb-4">3</div>
              <h3 className="text-xl font-medium mb-2">Optionally connect with others</h3>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 font-bold text-xl mb-4">4</div>
              <h3 className="text-xl font-medium mb-2">Save favorites and plan</h3>
            </div>
          </div>
          
          <p className="text-center mt-10 text-lg">
            Whether you're new in town or a local looking for something different, The Lineup keeps you in the loop.
          </p>
        </div>
      </section>

      <hr className="border-t border-gray-200 my-16" />

      {/* Social Map */}
      <section className="py-16 bg-gray-50 rounded-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-8">Not just an events list. A social map.</h2>
          
          <p className="text-lg mb-6">
            If you want, you can:
          </p>
          
          <ul className="space-y-2 mb-8 inline-block text-left">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> See which friends (or locals) are attending
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Chat, plan, and make real-life connections
            </li>
          </ul>
          
          <p className="text-lg italic">
            But if you're just here for the events, that's cool too. 🌞
          </p>
        </div>
      </section>

      <hr className="border-t border-gray-200 my-16" />

      {/* Call to Action */}
      <section className="py-16 mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">Ready to explore like a local?</h2>
          <Button asChild size="lg" className="bg-black hover:bg-black/90 text-white font-inter px-6">
            <Link to={isAuthenticated ? "/events" : "/signup"}>
              Create a Free Account
            </Link>
          </Button>
          <p className="mt-4 text-lg">and find your lineup.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
