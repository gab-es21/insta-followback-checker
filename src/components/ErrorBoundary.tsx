import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unexpected error', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="fatal-error" role="alert">
          <h1>Something went wrong</h1>
          <p>Reload the page and try again. Your data was never sent anywhere, so nothing was lost server-side.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
