
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useSignupForm } from '@/hooks/useSignupForm';
import { SignupSuccess } from './signup/SignupSuccess';
import { SignupStep1 } from './signup/SignupStep1';
import { SignupStep2 } from './signup/SignupStep2';
import GoogleAuthButton from './GoogleAuthButton';

export default function SignupForm({ onToggleMode }: { onToggleMode: () => void }) {
  const {
    form,
    step,
    loading,
    authLoading,
    errorMessage,
    registrationComplete,
    registeredEmail,
    blurredFields,
    onSubmit,
    nextStep,
    prevStep,
    handleGoogleLogin,
    handleFieldBlur,
  } = useSignupForm();

  if (registrationComplete) {
    return <SignupSuccess registeredEmail={registeredEmail} onToggleMode={onToggleMode} />;
  }

  return (
    <div className="space-y-4 w-full">
      {errorMessage && (
        <Alert variant="destructive" className="bg-coral/10 border-coral/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-graphite-grey">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && <SignupStep1 loading={loading} />}
          {step === 2 && <SignupStep2 loading={loading} blurredFields={blurredFields} handleFieldBlur={handleFieldBlur} />}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep} 
                disabled={loading}
                className="btn-secondary h-10 px-4"
              >
                Back
              </Button>
            )}
            
            {step < 2 ? (
              <Button 
                type="button" 
                onClick={nextStep} 
                disabled={loading} 
                className="btn-primary ml-auto h-10 px-4"
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={loading || authLoading} 
                className="btn-primary ml-auto h-10 px-4"
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            )}
          </div>
        </form>
      </Form>

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
      
      <GoogleAuthButton 
        onClick={handleGoogleLogin}
        loading={loading || authLoading}
        className="w-full h-10"
      >
        Sign up with Google
      </GoogleAuthButton>

      <div className="text-center text-sm text-graphite-grey pt-4">
        Already have an account?{" "}
        <button 
          onClick={onToggleMode}
          className="text-ocean-teal hover:text-ocean-teal/80 font-medium transition-colors"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
