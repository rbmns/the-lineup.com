
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
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
    this.setState({ errorInfo: errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', margin: '2rem', backgroundColor: '#fff0f0', border: '2px solid red', borderRadius: '8px', color: 'black' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Something went wrong.</h1>
          <p>We've encountered an unexpected error. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '0.5rem 1rem', marginTop: '1rem', border: '1px solid black', borderRadius: '4px', cursor: 'pointer' }}
          >
            Refresh Page
          </button>
          {this.state.error && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '4px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Error Details</summary>
                <p><strong>Error:</strong> {this.state.error.toString()}</p>
                {this.state.errorInfo && <p><strong>Stack Trace:</strong>{this.state.errorInfo.componentStack}</p>}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
