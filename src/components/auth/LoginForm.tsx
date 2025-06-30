
import React from 'react';
import { useLoginForm } from '@/hooks/useLoginForm';
import { LoginErrorDisplay } from '@/components/auth/LoginErrorDisplay';
import { RateLimitWarning } from '@/components/auth/RateLimitWarning';
import { DebugInfo } from '@/components/auth/DebugInfo';
import { LoginFormFields } from '@/components/auth/LoginFormFields';
import { useAuth } from '@/contexts/AuthContext';
import GoogleAuthButton from './GoogleAuthButton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface LoginFormProps {
  onToggleMode?: () => void;
  onForgotPassword?: () => void;
  suppressSuccessToast?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onToggleMode, 
  onForgotPassword,
  suppressSuccessToast = false
}) => {
  const {
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
  } = useLoginForm({ suppressSuccessToast });
  
  const { loginWithGoogle, loading: authLoading } = useAuth();

  const handleGoogleLogin = async () => {
    if (loading || authLoading) return;
    await loginWithGoogle();
  };

  return (
    <>
      <GoogleAuthButton 
        onClick={handleGoogleLogin} 
        loading={loading || authLoading}
      >
        Sign in with Google
      </GoogleAuthButton>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <LoginErrorDisplay 
        error={error}
        showAdvancedError={showAdvancedError}
        setShowAdvancedError={setShowAdvancedError}
        retryCount={retryCount}
        waitTime={waitTime}
        rateLimited={rateLimited}
      />
      
      <DebugInfo debugInfo={debugInfo} />
      
      <RateLimitWarning
        rateLimited={rateLimited}
        waitTime={waitTime}
      />
      
      <LoginFormFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loading={loading}
        rateLimited={rateLimited}
        onSubmit={handleSubmit}
      />
      
      <div className="text-sm text-center text-gray-500 space-y-2 mt-4">
        <p>
          Don't have an account?{' '}
          <button 
            onClick={onToggleMode}
            className="text-vibrant-seafoam hover:text-vibrant-seafoam/80 font-medium transition-colors"
            type="button"
          >
            Sign up
          </button>
        </p>
        {onForgotPassword && (
          <p>
            <button 
              onClick={onForgotPassword}
              className="text-vibrant-seafoam hover:text-vibrant-seafoam/80 transition-colors"
              type="button"
            >
              Forgot password?
            </button>
          </p>
        )}
      </div>
    </>
  );
};
