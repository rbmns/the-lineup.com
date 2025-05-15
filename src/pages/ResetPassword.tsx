
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { BrandLogo } from '@/components/ui/brand-logo';
import { AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rateLimited, setRateLimited] = useState(false);
  const [waitTime, setWaitTime] = useState(30); // Default wait time in seconds
  const [tokenProcessed, setTokenProcessed] = useState(false);
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Process the token first before anything else
  useEffect(() => {
    // Process URL parameters and set up session if needed
    const processResetToken = async () => {
      try {
        console.log("Processing URL for password reset token");
        console.log("URL hash:", location.hash);
        console.log("URL search params:", location.search);
        
        // First try to extract the token from URL hash (SPA redirects)
        if (location.hash && location.hash.length > 1) {
          console.log("Processing hash parameters");
          
          let hashParams;
          try {
            // Handle both formats: #access_token=... and #type=recovery&...
            if (location.hash.includes('type=')) {
              hashParams = new URLSearchParams(location.hash.substring(1));
            } else {
              // Extract parameters from hash without the # character
              const hashContent = location.hash.substring(1);
              const params = {};
              hashContent.split('&').forEach(part => {
                const [key, value] = part.split('=');
                if (key && value) params[key] = decodeURIComponent(value);
              });
              hashParams = new URLSearchParams();
              Object.entries(params).forEach(([key, value]) => {
                hashParams.append(key, value as string);
              });
            }
            
            const type = hashParams.get('type');
            const accessToken = hashParams.get('access_token');
            
            console.log("Hash params:", {type, accessToken});
            
            if ((type === 'recovery' || type === 'signup') && accessToken) {
              console.log("Valid recovery token found in hash");
              
              // Set session with the access token
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: '', // We don't have a refresh token from the URL
              });
              
              if (error) {
                console.error("Error setting session from hash token:", error);
                setPasswordError(`Error processing reset token: ${error.message}`);
                setTokenAvailable(false);
              } else {
                console.log("Session set successfully from hash token");
                setTokenAvailable(true);
              }
              
              setTokenProcessed(true);
              return;
            } else if (accessToken) {
              // We have an access token but no type specified, assume it's recovery
              console.log("Found access token without type, assuming recovery");
              
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: '',
              });
              
              if (error) {
                console.error("Error setting session from access token:", error);
                setPasswordError(`Error processing reset token: ${error.message}`);
                setTokenAvailable(false);
              } else {
                console.log("Session set successfully from access token");
                setTokenAvailable(true);
              }
              
              setTokenProcessed(true);
              return;
            }
          } catch (error) {
            console.error("Error parsing hash parameters:", error);
          }
        }
        
        // Then try URL params if hash doesn't work
        const urlParams = new URLSearchParams(location.search);
        const type = urlParams.get('type');
        const token = urlParams.get('token');
        
        console.log("URL params:", {type, token});
        
        if (token) {
          console.log("Found token in URL params");
          
          // For URL token param, we need to call the verifyOtp endpoint
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: type === 'recovery' ? 'recovery' : 'signup',
          });
          
          if (error) {
            console.error("Error verifying OTP:", error);
            setPasswordError(`Invalid or expired password reset link. Please request a new one.`);
            setTokenAvailable(false);
          } else {
            console.log("OTP verified successfully");
            setTokenAvailable(true);
          }
          
          setTokenProcessed(true);
          return;
        }
        
        // If we have a session, check if it's valid
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("Found existing session, checking if it's valid");
          setTokenAvailable(true);
          setTokenProcessed(true);
          return;
        }
        
        console.log("No valid recovery token found");
        setPasswordError("Invalid or expired password reset link. Please request a new one.");
        setTokenAvailable(false);
        setTokenProcessed(true);
      } catch (error: any) {
        console.error("Error parsing reset token:", error);
        setPasswordError(`Invalid or expired password reset link. Please request a new one.`);
        setTokenAvailable(false);
        setTokenProcessed(true);
      }
    };
    
    processResetToken();
  }, [location]);

  useEffect(() => {
    let timer: number | undefined;
    
    // If rate limited, start a countdown timer
    if (rateLimited && waitTime > 0) {
      timer = window.setTimeout(() => {
        setWaitTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (waitTime === 0) {
      setRateLimited(false);
      setPasswordError("");
    }
    
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [rateLimited, waitTime]);

  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setPasswordError('Password should be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleRateLimitError = () => {
    setRateLimited(true);
    setWaitTime(30); // Reset to 30 seconds wait time
    setPasswordError("You've reached the maximum allowed attempts. Please wait a moment before trying again.");
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
    
    // Password validation
    if (!validatePassword(password)) {
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Attempting to reset password");
      
      // Use updateUser method from Supabase
      const { error } = await supabase.auth.updateUser({ 
        password 
      });
      
      if (error) {
        console.error("Password reset error:", error);
        
        if (error.message?.toLowerCase().includes('rate limit')) {
          handleRateLimitError();
          return;
        }
        
        if (error.message?.toLowerCase().includes('session missing')) {
          setPasswordError('Your reset link has expired. Please request a new password reset link.');
          return;
        }
        
        throw error;
      }
      
      setSuccessMessage('Password has been reset successfully!');
      
      toast({
        title: 'Password reset successful',
        description: 'Your password has been updated. You can now log in with your new password.',
      });
      
      // Sign out to clear the session
      await supabase.auth.signOut();
      
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.message?.toLowerCase().includes('rate limit') || 
          error.message?.toLowerCase().includes('too many requests')) {
        handleRateLimitError();
      } else {
        setPasswordError(error.message || 'There was a problem resetting your password.');
        
        if (error.message?.toLowerCase().includes('session missing')) {
          setPasswordError('Your reset link has expired. Please request a new password reset link.');
        }
      }
      
      toast({
        title: 'Password reset failed',
        description: error.message || 'There was a problem resetting your password.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <BrandLogo />
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Create a new password for your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p>{passwordError}</p>
                </div>
              )}
              
              {successMessage && (
                <Alert className="bg-green-50 border-green-200">
                  <Check className="h-5 w-5 text-green-600" />
                  <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
                </Alert>
              )}
              
              {rateLimited && (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <AlertDescription className="text-amber-700">
                    Please wait {waitTime} seconds before trying again.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || !!successMessage || rateLimited || !tokenAvailable || !tokenProcessed}
                  required
                  placeholder="••••••••"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || !!successMessage || rateLimited || !tokenAvailable || !tokenProcessed}
                  required
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-purple hover:bg-purple/90"
                disabled={loading || !!successMessage || rateLimited || !tokenAvailable || !tokenProcessed}
              >
                {loading ? 'Updating...' : 'Reset Password'}
              </Button>
              
              {(!tokenAvailable && tokenProcessed) && (
                <Link to="/forgot-password" className="text-sm text-purple hover:underline self-center">
                  Request new reset link
                </Link>
              )}
              
              <Link to="/login" className="text-sm text-purple hover:underline self-center">
                Back to login
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
