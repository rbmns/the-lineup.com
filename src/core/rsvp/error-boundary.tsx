
/**
 * CRITICAL: RSVP ERROR BOUNDARY
 * 
 * ⚠️  WARNING: This component prevents RSVP failures from breaking the UI
 * ⚠️  Do not modify without understanding error handling implications
 */

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface RsvpErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface RsvpErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export class RsvpErrorBoundary extends Component<RsvpErrorBoundaryProps, RsvpErrorBoundaryState> {
  private maxRetries = 3;
  
  constructor(props: RsvpErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): RsvpErrorBoundaryState {
    console.error('🚨 RSVP Error Boundary Caught Error:', error);
    return {
      hasError: true,
      error,
      retryCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 RSVP Error Boundary Details:', error, errorInfo);
    
    // Report error to monitoring system
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      console.log('🔄 Retrying RSVP component...');
      this.setState(prevState => ({
        hasError: false,
        error: null,
        retryCount: prevState.retryCount + 1,
      }));
    } else {
      console.warn('⚠️  Maximum RSVP retries exceeded');
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            RSVP System Error
          </h3>
          <p className="text-sm text-red-600 mb-4 text-center">
            Something went wrong with the RSVP functionality. 
            {this.state.retryCount < this.maxRetries ? ' You can try again.' : ' Please refresh the page.'}
          </p>
          
          {this.state.retryCount < this.maxRetries ? (
            <Button
              onClick={this.handleRetry}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry ({this.maxRetries - this.state.retryCount} attempts left)
            </Button>
          ) : (
            <Button
              onClick={() => window.location.reload()}
              variant="default"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Page
            </Button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * CRITICAL: RSVP HOC for automatic error boundary wrapping
 */
export function withRsvpErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <RsvpErrorBoundary fallback={fallback}>
      <Component {...props} />
    </RsvpErrorBoundary>
  );
  
  WrappedComponent.displayName = `withRsvpErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
