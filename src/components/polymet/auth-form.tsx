
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserIcon,
  LockIcon,
  MailIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";

interface AuthFormProps {
  onLogin?: (email: string, password: string) => void;
  onSignup?: (name: string, email: string, password: string) => void;
  isLoading?: boolean;
  defaultTab?: "login" | "signup";
}

export default function AuthForm({
  onLogin,
  onSignup,
  isLoading = false,
  defaultTab = "login",
}: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  // Form validation
  const [errors, setErrors] = useState<{
    loginEmail?: string;
    loginPassword?: string;
    signupName?: string;
    signupEmail?: string;
    signupPassword?: string;
    signupConfirmPassword?: string;
  }>({});

  const validateLoginForm = () => {
    const newErrors: typeof errors = {};

    if (!loginEmail) {
      newErrors.loginEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      newErrors.loginEmail = "Email is invalid";
    }

    if (!loginPassword) {
      newErrors.loginPassword = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignupForm = () => {
    const newErrors: typeof errors = {};

    if (!signupName) {
      newErrors.signupName = "Name is required";
    }

    if (!signupEmail) {
      newErrors.signupEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupEmail)) {
      newErrors.signupEmail = "Email is invalid";
    }

    if (!signupPassword) {
      newErrors.signupPassword = "Password is required";
    } else if (signupPassword.length < 8) {
      newErrors.signupPassword = "Password must be at least 8 characters";
    }

    if (!signupConfirmPassword) {
      newErrors.signupConfirmPassword = "Please confirm your password";
    } else if (signupPassword !== signupConfirmPassword) {
      newErrors.signupConfirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLoginForm() && onLogin) {
      onLogin(loginEmail, loginPassword);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignupForm() && onSignup) {
      onSignup(signupName, signupEmail, signupPassword);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "login" | "signup")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="login" className="text-base">
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" className="text-base">
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-50" />

                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              {errors.loginEmail && (
                <p className="text-sm text-red-500">{errors.loginEmail}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-50" />

                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-50 hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.loginPassword && (
                <p className="text-sm text-red-500">{errors.loginPassword}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-secondary-50 text-vibrant-teal focus:ring-vibrant-teal"
                />

                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-primary-75"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-vibrant-teal hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="default"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-primary-75">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" className="w-full">
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                </svg>
                Google
              </Button>
              <Button variant="outline" type="button" className="w-full">
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"></path>
                </svg>
                Facebook
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-50" />

                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </div>
              {errors.signupName && (
                <p className="text-sm text-red-500">{errors.signupName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-50" />

                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
              {errors.signupEmail && (
                <p className="text-sm text-red-500">{errors.signupEmail}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-50" />

                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-50 hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.signupPassword && (
                <p className="text-sm text-red-500">{errors.signupPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-50" />

                <Input
                  id="signup-confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-50 hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.signupConfirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.signupConfirmPassword}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-secondary-50 text-vibrant-teal focus:ring-vibrant-teal"
              />

              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-primary-75"
              >
                I agree to the{" "}
                <Link
                  to="/terms-of-service"
                  className="font-medium text-vibrant-teal hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy-policy"
                  className="font-medium text-vibrant-teal hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="default"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
