
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, Star, ArrowRight, CheckCircle, Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useEventImages } from '@/hooks/useEventImages';
import { formatDate, formatEventTime } from '@/utils/date-formatting';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getEventImageUrl } = useEventImages();

  // Fetch featured events for the landing page
  const { data: featuredEvents = [] } = useQuery({
    queryKey: ['featured-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues:venue_id(*),
          creator:profiles(*)
        `)
        .order('start_date', { ascending: true })
        .limit(6);

      if (error) {
        console.error('Error fetching featured events:', error);
        return [];
      }

      return data?.map((eventData: any): Event => ({
        id: eventData.id,
        title: eventData.title,
        description: eventData.description || '',
        location: eventData.location,
        event_category: eventData.event_category,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        start_date: eventData.start_date,
        created_at: eventData.created_at,
        updated_at: eventData.updated_at,
        image_urls: eventData.image_urls || [],
        attendees: { going: 0, interested: 0 },
        venues: eventData.venues,
        creator: eventData.creator,
        venue_id: eventData.venue_id,
        organizer_link: eventData.organizer_link,
        fee: eventData.fee,
        booking_link: eventData.booking_link,
        extra_info: eventData.extra_info,
        tags: eventData.tags || [],
        coordinates: eventData.coordinates,
        created_by: eventData.created_by,
        vibe: eventData.vibe,
        slug: eventData.slug,
        destination: eventData.destination,
      })) || [];
    },
  });

  // Redirect authenticated users to home
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const eventCategories = [
    { name: 'Beach Events', count: featuredEvents.filter(e => e.event_category === 'beach').length, color: 'bg-blue-100 text-blue-800' },
    { name: 'Kite Surfing', count: featuredEvents.filter(e => e.event_category === 'kite').length, color: 'bg-cyan-100 text-cyan-800' },
    { name: 'Yoga & Wellness', count: featuredEvents.filter(e => e.event_category === 'yoga').length, color: 'bg-green-100 text-green-800' },
    { name: 'Music Events', count: featuredEvents.filter(e => e.event_category === 'music').length, color: 'bg-purple-100 text-purple-800' },
    { name: 'Food & Markets', count: featuredEvents.filter(e => e.event_category === 'food').length, color: 'bg-orange-100 text-orange-800' },
    { name: 'Community', count: featuredEvents.filter(e => e.event_category === 'community').length, color: 'bg-pink-100 text-pink-800' },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6"
              variants={fadeInUp}
            >
              Discover Amazing
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> Events</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Connect with your community, discover unique experiences, and make lasting memories with friends in beautiful locations.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/login">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600">Discover what's happening in your area</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {featuredEvents.slice(0, 6).map((event, index) => {
              const eventImage = getEventImageUrl(event);
              const formattedDate = formatDate(event.start_date || event.start_time || '');
              const timeDisplay = event.start_time ? formatEventTime(event.start_time, event.end_time) : '';
              
              return (
                <motion.div key={event.id} variants={fadeInUp}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      <img 
                        src={eventImage} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.event_category && (
                        <Badge className="absolute top-3 left-3" variant="secondary">
                          {event.event_category}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formattedDate && timeDisplay ? `${formattedDate} • ${timeDisplay}` : formattedDate}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="truncate">{event.venues?.name || event.location || 'Location TBA'}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div 
            className="text-center mt-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Button asChild variant="outline" size="lg">
              <Link to="/signup">View All Events</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-xl text-gray-600">Find events that match your interests</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {eventCategories.map((category, index) => (
              <motion.div key={category.name} variants={fadeInUp}>
                <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <Badge className={category.color}>{category.count} events</Badge>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600">Everything you need to discover and attend amazing events</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp}>
              <Card className="text-center p-6">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="mb-2">Connect with Community</CardTitle>
                <CardDescription>
                  Meet like-minded people and build lasting friendships through shared experiences.
                </CardDescription>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="text-center p-6">
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="mb-2">Discover Local Events</CardTitle>
                <CardDescription>
                  Find exciting events happening right in your neighborhood and beyond.
                </CardDescription>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="text-center p-6">
                <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle className="mb-2">Curated Experiences</CardTitle>
                <CardDescription>
                  Enjoy handpicked events that guarantee memorable and meaningful experiences.
                </CardDescription>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2 
              className="text-4xl font-bold mb-4"
              variants={fadeInUp}
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 opacity-90"
              variants={fadeInUp}
            >
              Join thousands of people who are already discovering amazing events and making new connections.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link to="/signup">
                  Join Now - It's Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
