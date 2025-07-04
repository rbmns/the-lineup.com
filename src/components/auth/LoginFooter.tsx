
import React from 'react';

interface LoginFooterProps {
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

export const LoginFooter: React.FC<LoginFooterProps> = ({ onToggleMode, onForgotPassword }) => {
  return (
    <div className="text-sm text-center text-gray-500 space-y-2 mt-4">
      <p>
        Don't have an account?{' '}
        <button 
          onClick={onToggleMode}
          className="text-purple hover:underline"
          type="button"
        >
          Sign up
        </button>
      </p>
      <p>
        <button 
          onClick={onForgotPassword}
          className="text-purple hover:underline"
          type="button"
        >
          Forgot password?
        </button>
      </p>
    </div>
  );
};
