
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock Supabase auth endpoints
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        user_metadata: {},
      },
    });
  }),

  // Mock events endpoint
  http.get('*/rest/v1/events', () => {
    return HttpResponse.json([
      {
        id: 'mock-event-1',
        title: 'Test Event',
        description: 'A test event',
        start_date: '2024-01-15',
        start_time: '19:00:00',
        end_time: '22:00:00',
        event_category: 'Music',
        status: 'published',
        timezone: 'Europe/Amsterdam',
        venues: {
          id: 'venue-1',
          name: 'Test Venue',
          city: 'Amsterdam',
        },
      },
    ]);
  }),

  // Mock user profiles endpoint
  http.get('*/rest/v1/profiles', () => {
    return HttpResponse.json([
      {
        id: 'mock-user-id',
        username: 'testuser',
        email: 'test@example.com',
      },
    ]);
  }),
];
