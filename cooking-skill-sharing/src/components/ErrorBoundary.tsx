import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
          <p className="mt-2 text-red-700">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 rounded-md bg-red-100 px-4 py-2 text-red-800 hover:bg-red-200"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
