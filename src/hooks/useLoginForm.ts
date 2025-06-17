
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface LoginFormData {
  email: string;
  password: string;
}

interface UseLoginFormOptions {
  suppressSuccessToast?: boolean;
}

export const useLoginForm = (options: UseLoginFormOptions = {}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [waitTime, setWaitTime] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showAdvancedError, setShowAdvancedError] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Login error:', authError);
        setError(authError.message || 'Login failed');
        setRetryCount(prev => prev + 1);
        
        // Check for rate limiting
        if (authError.message?.includes('rate limit') || authError.message?.includes('too many requests')) {
          setRateLimited(true);
          setWaitTime(60); // Default wait time
        }
        
        setDebugInfo(`Error: ${authError.message}\nCode: ${authError.status || 'unknown'}`);
        return;
      }

      if (!options.suppressSuccessToast) {
        toast.success('Login successful!');
      }
      
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Unexpected login error:', error);
      setError('An unexpected error occurred');
      setDebugInfo(`Unexpected error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Legacy support for the old handleLogin method
  const handleLogin = handleSubmit;

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    isLoading: loading, // For backward compatibility
    error,
    rateLimited,
    waitTime,
    debugInfo,
    retryCount,
    showAdvancedError,
    setShowAdvancedError,
    handleSubmit,
    handleLogin,
  };
};
