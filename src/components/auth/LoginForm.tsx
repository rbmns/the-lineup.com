import React from 'react';
import { useLoginForm } from '@/hooks/useLoginForm';
import { LoginErrorDisplay } from '@/components/auth/LoginErrorDisplay';
import { RateLimitWarning } from '@/components/auth/RateLimitWarning';
import { DebugInfo } from '@/components/auth/DebugInfo';
import { LoginFormFields } from '@/components/auth/LoginFormFields';
import { LoginFooter } from '@/components/auth/LoginFooter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface LoginFormProps {
  onToggleMode: () => void;
  onForgotPassword: () => void;
  suppressSuccessToast?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onToggleMode, 
  onForgotPassword,
  suppressSuccessToast = true // Changed default to true to suppress success toasts
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
      
      {/* Always use variant="primary" and size="lg" for Google auth to keep a strong CTA look */}
      <Button 
        variant="primary"
        size="lg"
        className="w-full" 
        onClick={handleGoogleLogin} 
        disabled={loading || authLoading}
      >
        <svg
          className="mr-2 h-4 w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
        </svg>
        Sign in with Google
      </Button>
      
      <LoginFooter
        onToggleMode={onToggleMode}
        onForgotPassword={onForgotPassword}
      />
    </>
  );
};
