
import React from 'react';
import { useLoginForm } from '@/hooks/useLoginForm';
import { LoginErrorDisplay } from '@/components/auth/LoginErrorDisplay';
import { RateLimitWarning } from '@/components/auth/RateLimitWarning';
import { DebugInfo } from '@/components/auth/DebugInfo';
import { LoginFormFields } from '@/components/auth/LoginFormFields';
import { useAuth } from '@/contexts/AuthContext';
import GoogleAuthButton from './GoogleAuthButton';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-6">
      <GoogleAuthButton 
        onClick={handleGoogleLogin} 
        loading={loading || authLoading}
        className="w-full"
      >
        Sign in with Google
      </GoogleAuthButton>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-mist-grey" />
        </div>
        <div className="relative flex justify-center text-xs uppercase font-mono tracking-wide">
          <span className="bg-pure-white px-3 text-graphite-grey/60">
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
      
      <div className="text-body-small text-graphite-grey space-y-3 pt-4">
        <div className="text-center">
          Don't have an account?{' '}
          <button 
            onClick={onToggleMode}
            className="text-ocean-teal hover:text-ocean-teal/80 font-medium transition-colors"
            type="button"
          >
            Sign up
          </button>
        </div>
        {onForgotPassword && (
          <div className="text-center">
            <button 
              onClick={onForgotPassword}
              className="text-ocean-teal hover:text-ocean-teal/80 transition-colors"
              type="button"
            >
              Forgot password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
