import { Component } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
export default class ErrorBoundary extends Component {
    state = { hasError: false, error: null };
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback)
                return this.props.fallback;
            return (<div className="min-h-[400px] flex flex-col items-center justify-center gap-4 p-8">
          <div className="w-16 h-16 rounded-2xl bg-danger/15 border border-danger/30 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-danger"/>
          </div>
          <h2 className="text-xl font-semibold text-text-primary font-display">Something went wrong</h2>
          <p className="text-sm text-text-muted text-center max-w-md">
            {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
          </p>
          <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }} className="glass-button px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <RefreshCw className="w-4 h-4"/> Retry
          </button>
        </div>);
        }
        return this.props.children;
    }
}
