
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Music, Waves, Utensils, Dumbbell, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { EventCategoryIcon } from '@/components/ui/event-category-icon';
import { Footer } from '@/components/ui/footer';
import { EventsSignupTeaser } from '@/components/events/list-components/EventsSignupTeaser';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container px-4 mx-auto">
      {/* Hero Section with reduced padding */}
      <section className="py-10 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Find the Best Local Events — Beachlife, Markets, Music & More
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            Whether you’re flying solo or meeting up with friends, the Lineup helps you explore Zandvoort’s best local vibes — from wellness sessions and food festivals to parties and beachside hangouts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-black hover:bg-black/90 text-white font-inter px-6">
              <Link to={isAuthenticated ? "/profile" : "/signup"}>
                Create Your Free Profile
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 px-6">
              <Link to="/events">
               Just Browse Events
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <hr className="border-t border-gray-200 my-12" />

      {/* Featured Event Types with clickable categories */}
      <section className="py-10 bg-gray-50 rounded-xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-8">Featured Event Types</h2>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
            <Link to="/events" className="flex flex-col items-center p-3 hover:bg-white rounded-lg transition-colors">
              <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Music size={28} strokeWidth={1.5} className="text-purple-600" />
              </div>
              <span className="font-medium text-sm">Music & Festivals</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 hover:bg-white rounded-lg transition-colors">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Waves size={28} strokeWidth={1.5} className="text-blue-600" />
              </div>
              <span className="font-medium text-sm">Beach & Wellness</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 hover:bg-white rounded-lg transition-colors">
              <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <Utensils size={28} strokeWidth={1.5} className="text-orange-600" />
              </div>
              <span className="font-medium text-sm">Food Trucks</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 hover:bg-white rounded-lg transition-colors">
              <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Dumbbell size={28} strokeWidth={1.5} className="text-green-600" />
              </div>
              <span className="font-medium text-sm">Sports & Games</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 hover:bg-white rounded-lg transition-colors">
              <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mb-2">
                <Calendar size={28} strokeWidth={1.5} className="text-red-600" />
              </div>
              <span className="font-medium text-sm">Arts & Culture</span>
            </Link>
            
            <Link to="/events" className="flex flex-col items-center p-3 hover:bg-white rounded-lg transition-colors">
              <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                <Users size={28} strokeWidth={1.5} className="text-indigo-600" />
              </div>
              <span className="font-medium text-sm">Community</span>
            </Link>
          </div>
          
          <p className="text-center mt-6 text-base">
            No random listings. Just the good stuff.
          </p>
        </div>
      </section>

      <hr className="border-t border-gray-200 my-12" />

      {/* How It Works with updated content */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-8">How It Works</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 font-bold text-xl mb-3">1</div>
              <h3 className="text-lg font-medium mb-1">Browse events near you</h3>
              <p className="text-sm text-gray-600">No sign-up needed to explore</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 font-bold text-xl mb-3">2</div>
              <h3 className="text-lg font-medium mb-1">See event details</h3>
              <p className="text-sm text-gray-600">Get all the info you need</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 font-bold text-xl mb-3">3</div>
              <h3 className="text-lg font-medium mb-1">Connect with others</h3>
              <p className="text-sm text-gray-600">Only if you choose to sign up</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 font-bold text-xl mb-3">4</div>
              <h3 className="text-lg font-medium mb-1">Save favorites & plan</h3>
              <p className="text-sm text-gray-600">Organize your calendar</p>
            </div>
          </div>

          <div className="mt-10 bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">Create a profile to easily spot your friends</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-base mb-2">See who's going to events</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">SM</span>
                  </div>
                  <span>Sam M. is going</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-medium">JD</span>
                  </div>
                  <span>Jamie D. is interested</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-base mb-2">Find your friends' favorite events</h4>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="text-purple-600 font-medium">Beach Yoga</span>
                  <p>3 friends attending this weekly event</p>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center z-30">
                    <span className="text-orange-600 text-xs font-medium">AK</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center z-20">
                    <span className="text-blue-600 text-xs font-medium">TJ</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center z-10">
                    <span className="text-purple-600 text-xs font-medium">MS</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-black hover:bg-black/90 text-white">
                <Link to="/signup">Create Free Account</Link>
              </Button>
              
              <p className="text-gray-600 text-sm">
                Not ready to share? No worries — <Link to="/events" className="text-blue-600 hover:underline">browse events anonymously</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t border-gray-200 my-12" />

      {/* Social Map Section */}
      <section className="py-10 bg-gray-50 rounded-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">Not just an events list. A social map.</h2>
          
          <p className="text-lg mb-5">
            If you want, you can:
          </p>
          
          <ul className="space-y-2 mb-6 inline-block text-left">
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

      <hr className="border-t border-gray-200 my-12" />

      {/* Nearby Locations with Images */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-8">Popular Nearby Locations</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/events" className="group">
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" 
                  alt="Nature location" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-medium text-lg">North Beach</h3>
              <p className="text-sm text-gray-600">12 upcoming events</p>
            </Link>
            
            <Link to="/events" className="group">
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1518495973542-4542c06a5843" 
                  alt="Forest location" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-medium text-lg">City Park</h3>
              <p className="text-sm text-gray-600">8 upcoming events</p>
            </Link>
            
            <Link to="/events" className="group">
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21" 
                  alt="Beach location" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-medium text-lg">Sunset Beach</h3>
              <p className="text-sm text-gray-600">15 upcoming events</p>
            </Link>
          </div>
        </div>
      </section>

      <hr className="border-t border-gray-200 my-12" />

      {/* Call to Action with browse option */}
      <section className="py-10 mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">Ready to explore like a local?</h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-black hover:bg-black/90 text-white font-inter px-6">
              <Link to={isAuthenticated ? "/events" : "/signup"}>
                Create a Free Account
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="font-inter px-6">
              <Link to="/events">
                Just Browse Events
              </Link>
            </Button>
          </div>
          
          <p className="mt-4 text-lg">and find your lineup.</p>
        </div>
      </section>
      
      <EventsSignupTeaser />
    </div>
  );
};

export default LandingPage;
