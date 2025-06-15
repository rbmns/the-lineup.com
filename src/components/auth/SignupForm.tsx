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
    <div className="space-y-4 max-w-md w-full">
      {errorMessage && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-normal text-red-800">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && <SignupStep1 loading={loading} />}
          {step === 2 && <SignupStep2 loading={loading} blurredFields={blurredFields} handleFieldBlur={handleFieldBlur} />}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} disabled={loading}>
                Back
              </Button>
            )}
            
            {step < 2 ? (
              <Button type="button" variant="primary" onClick={nextStep} disabled={loading} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button type="submit" variant="primary" disabled={loading || authLoading} className="ml-auto">
                {loading ? "Creating account..." : "Create account"}
              </Button>
            )}
          </div>
        </form>
      </Form>

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
      
      <GoogleAuthButton 
        onClick={handleGoogleLogin}
        loading={loading || authLoading}
      >
        Sign up with Google
      </GoogleAuthButton>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Button variant="link" className="p-0" onClick={onToggleMode}>
          Sign in
        </Button>
      </div>
    </div>
  );
}
