
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
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-sm font-medium text-graphite-grey">
          Email Address
        </Label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={loading || rateLimited}
          className="h-10"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-sm font-medium text-graphite-grey">
          Password
        </Label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={loading || rateLimited}
          className="h-10"
          required
        />
      </div>
      
      <Button 
        type="submit"
        disabled={loading || rateLimited} 
        className="w-full h-10 bg-ocean-teal hover:bg-ocean-teal/90 text-white"
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};
