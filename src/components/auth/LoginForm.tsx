
import React from 'react';
import { useLoginForm } from '@/hooks/useLoginForm';
import { LoginErrorDisplay } from '@/components/auth/LoginErrorDisplay';
import { RateLimitWarning } from '@/components/auth/RateLimitWarning';
import { DebugInfo } from '@/components/auth/DebugInfo';
import { LoginFormFields } from '@/components/auth/LoginFormFields';
import { LoginFooter } from '@/components/auth/LoginFooter';

interface LoginFormProps {
  onToggleMode: () => void;
  onForgotPassword: () => void;
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
      
      <LoginFooter
        onToggleMode={onToggleMode}
        onForgotPassword={onForgotPassword}
      />
    </>
  );
};
