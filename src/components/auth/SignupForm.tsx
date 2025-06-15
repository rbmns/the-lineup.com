
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useSignupForm } from '@/hooks/useSignupForm';
import { SignupSuccess } from './signup/SignupSuccess';
import { SignupStep1 } from './signup/SignupStep1';
import { SignupStep2 } from './signup/SignupStep2';

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
              <Button type="button" onClick={nextStep} disabled={loading} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={loading || authLoading} className="ml-auto">
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
      
      <Button 
        variant="outline" 
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
        Sign up with Google
      </Button>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Button variant="link" className="p-0" onClick={onToggleMode}>
          Sign in
        </Button>
      </div>
    </div>
  );
}
