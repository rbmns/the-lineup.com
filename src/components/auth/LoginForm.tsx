
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast, useToast } from '@/hooks/use-toast';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { completeLogout, checkEmailRateLimit, markAuthAttempt, resetRateLimit } from '@/integrations/supabase/client';

interface LoginFormProps {
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rateLimited, setRateLimited] = useState(checkEmailRateLimit());
  const [waitTime, setWaitTime] = useState(30); // Default wait time in seconds
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showAdvancedError, setShowAdvancedError] = useState(false);

  useEffect(() => {
    // Check if we're rate limited at component mount
    setRateLimited(checkEmailRateLimit());
    
    let timer: number | undefined;
    
    // If rate limited, start a countdown timer
    if (rateLimited && waitTime > 0) {
      timer = window.setTimeout(() => {
        setWaitTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (waitTime === 0) {
      setRateLimited(false);
      setError(null);
      resetRateLimit();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [rateLimited, waitTime]);

  const handleRateLimitError = () => {
    markAuthAttempt();
    setRateLimited(true);
    setWaitTime(30); // Reset to 30 seconds wait time
    setError("You've reached the maximum allowed attempts. Please wait a moment before trying again.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rateLimited) {
      toast({
        title: "Action limited",
        description: `Please wait ${waitTime} seconds before trying again.`,
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      // First ensure we're completely signed out
      setDebugInfo("Starting login process: Logging out any existing session");
      await completeLogout();

      if (!signIn) {
        throw new Error("Sign-in function is not available.");
      }
      
      console.log("Starting login process for:", email);
      setDebugInfo(`${debugInfo || ''}\nAttempting login with email: ${email}`);
      
      // Mark this attempt for rate limiting
      markAuthAttempt();
      
      // If we've had multiple retries, add a delay to help with rate limiting
      if (retryCount > 0) {
        setDebugInfo(prev => `${prev || ''}\nAdding delay before login attempt (retry ${retryCount})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error details:", error);
        setDebugInfo(prevDebug => `${prevDebug || ''}\nError: ${error.message}`);
        
        // Handle specific error cases
        if (error.message?.toLowerCase().includes('rate limit') || 
            error.message?.toLowerCase().includes('too many requests')) {
          handleRateLimitError();
          setRetryCount(prev => prev + 1);
        } else if (error.message?.toLowerCase().includes('invalid credentials')) {
          setError("Invalid email or password. Please try again.");
          setRetryCount(prev => prev + 1);
        } else if (error.message?.toLowerCase().includes('timeout')) {
          setError("The request timed out. This might be due to server load or rate limiting. Please try again in a moment.");
          setRetryCount(prev => prev + 1);
        } else {
          setError(error.message || "Invalid credentials. Please try again.");
          setRetryCount(prev => prev + 1);
        }
        return;
      }
      
      setDebugInfo(prevDebug => `${prevDebug || ''}\nLogin successful.`);
      resetRateLimit();
      setRetryCount(0);
      
      // Removed successful login toast - no confirmation needed
      
      // Auth context will handle redirects
    } catch (error: any) {
      console.error("Login failed:", error.message);
      setError(error.message || "Login failed. Please try again.");
      setDebugInfo(prevDebug => `${prevDebug || ''}\nException: ${error.message}`);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p>{error}</p>
            {(error.includes("rate limit") || error.includes("timed out") || error.includes("too many requests")) && (
              <p className="text-sm mt-1">Supabase limits authentication attempts to prevent abuse. Please try again later.</p>
            )}
            <button 
              className="text-xs underline mt-1 text-red-600"
              onClick={() => setShowAdvancedError(!showAdvancedError)}
            >
              {showAdvancedError ? "Hide technical details" : "Show technical details"}
            </button>
          </div>
        </div>
      )}
      
      {showAdvancedError && error && (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded flex items-start mt-2 mb-4">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold">Technical information:</p>
            <p>This issue may be related to Supabase's rate limiting. Your account may be temporarily restricted due to multiple login attempts.</p>
            <p className="mt-1">Retry count: {retryCount}</p>
            <p>Wait time: {waitTime} seconds</p>
            <p>Rate limited: {rateLimited ? "Yes" : "No"}</p>
          </div>
        </div>
      )}
      
      {debugInfo && (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded flex items-start mb-4">
          <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      )}
      
      {rateLimited && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p>Please wait {waitTime} seconds before trying again.</p>
            <p className="text-xs mt-1">Supabase limits how frequently you can attempt authentication to prevent abuse.</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading || rateLimited}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={loading || rateLimited}
            required
          />
        </div>
        
        <Button 
          type="submit"
          disabled={loading || rateLimited} 
          className="w-full bg-purple hover:bg-purple/90 text-white"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <div className="text-sm text-center text-gray-500 space-y-2 mt-4">
        <p>
          Don't have an account?{' '}
          <button 
            onClick={onToggleMode}
            className="text-purple hover:underline"
            type="button"
          >
            Sign up
          </button>
        </p>
        <p>
          <button 
            onClick={onForgotPassword}
            className="text-purple hover:underline"
            type="button"
          >
            Forgot password?
          </button>
        </p>
      </div>
    </>
  );
};
