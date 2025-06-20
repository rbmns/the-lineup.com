
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface EventbriteEvent {
  title: string;
  description: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  image_url: string | null;
  url: string;
  source: string;
  tags: string[];
}

interface EventbriteResponse {
  events: EventbriteEvent[];
  count: number;
}

export const EventbriteEventsList: React.FC = () => {
  const [events, setEvents] = useState<EventbriteEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEventbriteEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Calling Eventbrite edge function...');
      
      const { data, error: functionError } = await supabase.functions.invoke('fetch-eventbrite-events');
      
      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(`Function error: ${functionError.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned from function');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      console.log('Eventbrite events fetched:', data);
      setEvents(data.events || []);
      toast.success(`Fetched ${data.count || 0} Eventbrite events`);
      
    } catch (err) {
      console.error('Error fetching Eventbrite events:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`Failed to fetch events: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventbriteEvents();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Eventbrite Events</h2>
        <Button 
          onClick={fetchEventbriteEvents} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">Error: {error}</p>
          <Button 
            onClick={fetchEventbriteEvents} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Fetching your Eventbrite events...</span>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No upcoming events found on your Eventbrite account.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            {event.image_url && (
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="line-clamp-2">{event.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {event.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {event.description}
                </p>
              )}
              
              <div className="space-y-2">
                {event.start_time && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(event.start_time)}</span>
                  </div>
                )}
                
                {event.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                )}
              </div>
              
              {event.url && (
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  <a 
                    href={event.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Eventbrite
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
