
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { checkEmailRateLimit, markAuthAttempt, resetRateLimit } from '@/integrations/supabase/client';
import { handleRateLimitError, prepareLoginProcess, handleSuccessfulLogin } from '@/utils/auth-utils';

interface UseLoginFormProps {
  suppressSuccessToast?: boolean;
}

export const useLoginForm = ({ suppressSuccessToast = false }: UseLoginFormProps = {}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
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
      await prepareLoginProcess();

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
          const rateLimitData = handleRateLimitError();
          setRateLimited(rateLimitData.rateLimited);
          setWaitTime(rateLimitData.waitTime);
          setError(rateLimitData.error);
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
      setRetryCount(handleSuccessfulLogin());
      
      // Only show success toast if not suppressed
      if (!suppressSuccessToast) {
        toast({
          title: "Login successful",
          description: "You are now logged in.",
        });
      }
      
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

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    rateLimited,
    waitTime,
    debugInfo,
    retryCount,
    showAdvancedError,
    setShowAdvancedError,
    handleSubmit,
  };
};
