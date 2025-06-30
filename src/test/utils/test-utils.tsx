
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthContext } from '@/contexts/AuthContext';

// Mock user for testing
const mockUser = {
  id: 'mock-user-id',
  email: 'test@example.com',
  user_metadata: {},
};

const mockAuthContext = {
  user: mockUser,
  session: {
    user: mockUser,
    access_token: 'mock-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    expires_at: Date.now() + 3600000,
  },
  profile: {
    id: 'mock-user-id',
    username: 'testuser',
    email: 'test@example.com',
    avatar_url: [],
    location: 'Test City',
    location_category: 'City',
    status: 'Active',
    status_details: '',
    tagline: 'Test tagline',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  isAuthenticated: true,
  loading: false,
  isNewUser: false,
  setIsNewUser: vi.fn(),
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  loginWithEmail: vi.fn(),
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  updateProfile: vi.fn(),
  refreshProfile: vi.fn(),
};

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthContext}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
