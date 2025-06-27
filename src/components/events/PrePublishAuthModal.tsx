
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface PrePublishAuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PrePublishAuthModal: React.FC<PrePublishAuthModalProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !gdprConsent) {
      toast({
        title: "Please accept our terms",
        description: "You need to accept our privacy policy to create an account.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        console.log("Attempting login with email:", email);
        const { error } = await signIn(email, password);
        if (error) {
          console.error("Login error:", error);
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        console.log("Login successful");
      } else {
        console.log("Attempting signup with email:", email);
        const { error } = await signUp(email, password, name);
        if (error) {
          console.error("Signup error:", error);
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        console.log("Signup successful");
      }

      toast({
        title: "Welcome! 🎉",
        description: isLogin ? "You're now logged in." : "Account created successfully!",
      });

      // Wait a moment for auth state to update, then call success
      setTimeout(() => {
        onSuccess();
      }, 1000);

    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-primary">
            {isLogin ? "Sign in to publish" : "Create your account to publish your event"}
          </DialogTitle>
        </DialogHeader>

        <div className="text-center mb-6">
          <p className="text-neutral leading-relaxed">
            {isLogin 
              ? "Welcome back! Sign in to publish your event."
              : "Join the community and make your event live for everyone to discover."
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div className="flex items-start space-x-2">
              <Checkbox
                id="gdpr"
                checked={gdprConsent}
                onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
              />
              <Label htmlFor="gdpr" className="text-sm leading-relaxed">
                I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
              </Label>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? "Processing..." 
              : isLogin 
                ? "Sign in & Publish" 
                : "Create Account & Publish"
            }
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
            disabled={isSubmitting}
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
