
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [waitTime, setWaitTime] = useState(30); // Default wait time in seconds

  // Sign out any existing user before processing password reset
  useEffect(() => {
    const signOutExistingUser = async () => {
      try {
        console.log("Signing out any existing users on forgot password page");
        await supabase.auth.signOut({ scope: 'global' });
        console.log("User signed out successfully");
      } catch (err) {
        console.error("Error signing out:", err);
      }
    };
    
    signOutExistingUser();
  }, []);

  useEffect(() => {
    let timer: number | undefined;
    
    // If rate limited, start a countdown timer
    if (rateLimited && waitTime > 0) {
      timer = window.setTimeout(() => {
        setWaitTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (waitTime === 0) {
      setRateLimited(false);
      setError(null);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [rateLimited, waitTime]);

  const handleRateLimitError = () => {
    setRateLimited(true);
    setWaitTime(30); // Reset to 30 seconds wait time
    setError("Too many password reset attempts. Please wait a moment before trying again.");
    
    toast({
      title: "Too many attempts",
      description: "Please wait a moment before requesting another password reset.",
      variant: "destructive"
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rateLimited) {
      toast({
        title: "Action limited",
        description: `Please wait ${waitTime} seconds before trying again.`,
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    setInfoMessage(null);
    
    try {
      // Always ensure user is signed out before sending password reset
      console.log("Ensuring user is signed out before sending password reset email");
      await supabase.auth.signOut({ scope: 'global' });
      
      console.log("Sending password reset email to:", email);
      
      // Generate absolute URL with timestamp to avoid caching issues
      const origin = window.location.origin;
      const timestamp = new Date().getTime();
      const redirectUrl = `${origin}/reset-password?t=${timestamp}`;
      
      console.log("Full redirect URL:", redirectUrl);
      
      // Use direct Supabase call with proper redirectTo URL
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      console.log("Password reset response:", { error });
      
      if (error) {
        console.error("Password reset error details:", error);
        
        // Handle specific error cases
        if (error.message?.toLowerCase().includes('rate limit') || 
            error.message?.toLowerCase().includes('too many requests')) {
          handleRateLimitError();
        } else if (error.message?.toLowerCase().includes('email not found')) {
          setError("We couldn't find an account with that email address.");
          toast({
            title: "Email not found",
            description: "We couldn't find an account with that email address.",
            variant: "destructive"
          });
        } else {
          setError(error.message || "Failed to send password reset email. Please try again.");
          toast({
            title: "Password reset failed",
            description: error.message || "Failed to send password reset email. Please try again.",
            variant: "destructive"
          });
        }
        return;
      }
      
      setInfoMessage("Password reset instructions sent to your email.");
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions to reset your password.",
        variant: "success"
      });
    } catch (error: any) {
      console.error("Password reset failed:", error.message);
      setError(error.message || "Failed to send password reset email. Please try again.");
      toast({
        title: "Password reset failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      {infoMessage && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-700">{infoMessage}</AlertDescription>
        </Alert>
      )}
      
      {rateLimited && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>Please wait {waitTime} seconds before trying again.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading || rateLimited || !!infoMessage}
            required
          />
        </div>
        
        <Button 
          type="submit"
          disabled={loading || rateLimited || !!infoMessage} 
          className="w-full bg-purple hover:bg-purple/90 text-white"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
      
      <div className="text-sm text-center text-gray-500 mt-4">
        <button 
          onClick={onBackToLogin}
          className="text-purple hover:underline"
        >
          Back to login
        </button>
      </div>
    </>
  );
};
