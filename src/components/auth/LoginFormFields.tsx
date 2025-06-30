
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  rateLimited: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  rateLimited,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="login-email" className="text-base font-semibold text-ocean-deep">
          Email Address
        </Label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={loading || rateLimited}
          className="h-12 text-base border-2 border-mist-grey focus:border-ocean-teal transition-colors"
          required
        />
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="login-password" className="text-base font-semibold text-ocean-deep">
          Password
        </Label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={loading || rateLimited}
          className="h-12 text-base border-2 border-mist-grey focus:border-ocean-teal transition-colors"
          required
        />
      </div>
      
      <Button 
        type="submit"
        disabled={loading || rateLimited} 
        variant="primary"
        className="w-full h-12 text-base"
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};
