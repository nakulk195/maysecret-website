import React from 'react';

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[AppErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 px-4 py-16">
          <div className="mx-auto max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
            <h1 className="text-xl font-semibold text-gray-900">Something went wrong</h1>
            <p className="mt-3 text-sm text-gray-600">
              Please refresh the page. Your payment and order data are safely stored in Supabase when the request succeeds.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
