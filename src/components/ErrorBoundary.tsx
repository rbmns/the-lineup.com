
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-6 max-w-lg p-8 bg-card text-card-foreground rounded-lg shadow-lg">
            <h1 className="text-5xl font-bold text-destructive">Oops!</h1>
            <h2 className="text-3xl font-semibold tracking-tight">Something went wrong</h2>
            <p className="text-muted-foreground">
              We've encountered an unexpected error. Please try refreshing the page. If the problem persists, please contact support.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left text-sm">
                  <summary className="cursor-pointer">Error Details</summary>
                  <pre className="mt-2 bg-muted p-4 rounded-md overflow-x-auto">
                    {this.state.error.toString()}
                    <br />
                    {this.state.error.stack}
                  </pre>
              </details>
            )}
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
