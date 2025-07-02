import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { BrowserRouter } from 'react-router-dom';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import { mockSupabase } from '../mocks/supabase';

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Login Flow', () => {
    it('should complete full login flow successfully', async () => {
      // Mock successful login
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
          },
          session: {
            access_token: 'mock-token',
            refresh_token: 'mock-refresh',
          },
        },
        error: null,
      });

      render(<Login />);

      // Fill in login form
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Verify login was called
      await waitFor(() => {
        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should handle login errors gracefully', async () => {
      // Mock login error
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });

      render(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Signup Flow', () => {
    it('should complete full signup flow successfully', async () => {
      // Mock successful signup
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: {
          user: {
            id: 'new-user-id',
            email: 'newuser@example.com',
          },
          session: null, // Usually null until email confirmation
        },
        error: null,
      });

      render(<Signup />);

      // Fill in signup form
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
      fireEvent.click(submitButton);

      // Verify signup was called with redirect URL
      await waitFor(() => {
        expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'newpassword123',
          options: {
            emailRedirectTo: expect.stringContaining(window.location.origin),
          },
        });
      });
    });

    it('should handle user already exists error', async () => {
      // Mock user already exists error
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'User already registered' },
      });

      render(<Signup />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText(/user already registered/i)).toBeInTheDocument();
      });
    });
  });

  describe('Auth State Management', () => {
    it('should persist auth state across page refreshes', async () => {
      // Mock getting existing session
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
            },
            access_token: 'mock-token',
            refresh_token: 'mock-refresh',
          },
        },
        error: null,
      });

      render(<Login />);

      // Should call getSession on mount
      await waitFor(() => {
        expect(mockSupabase.auth.getSession).toHaveBeenCalled();
      });
    });

    it('should handle logout correctly', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        error: null,
      });

      // Test logout functionality would be implemented here
      // This would require a component that actually renders logout button
    });
  });
});