import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { HomeEventsPreview } from '@/components/home/HomeEventsPreview';
import { HomeUsersPreview } from '@/components/home/HomeUsersPreview';
import { HomeCasualPlansPreview } from '@/components/home/HomeCasualPlansPreview';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { HomeWelcomeSection } from '@/components/home/HomeWelcomeSection';
import { useAuth } from '@/contexts/AuthContext';
import { useMetaTags } from '@/hooks/useMetaTags';

const Home = () => {
  const { user } = useAuth();

  // Set meta tags for home page
  useMetaTags({
    title: 'the lineup | Join the Flow',
    description: 'Find events, connect with locals and friends, and join the flow of every place you land.',
    image: 'https://vbxhcqlcbusqwsqesoxw.supabase.co/storage/v1/object/public/branding//OG%20Image.png',
    url: window.location.origin,
    type: 'website'
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['homeEvents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues!events_venue_id_fkey (
            id,
            name,
            city,
            street,
            postal_code
          )
        `)
        .eq('status', 'published')
        .order('start_date', { ascending: true })
        .limit(6);

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      return data;
    },
  });

  const { data: casualPlans, isLoading: casualPlansLoading } = useQuery({
    queryKey: ['homeCasualPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('casual_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching casual plans:', error);
        throw error;
      }

      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <HomeHeroSection />
      
      {user && <HomeWelcomeSection />}
      
      <HomeEventsPreview events={events} isLoading={eventsLoading} />
      <HomeCasualPlansPreview plans={casualPlans} isLoading={casualPlansLoading} />
      <HomeUsersPreview />
    </div>
  );
};

export default Home;
