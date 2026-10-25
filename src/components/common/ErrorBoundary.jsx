import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          style={{
            padding: '32px 24px',
            backgroundColor: '#FAF7F2',
            border: '1px solid #EAE3D6',
            borderRadius: '12px',
            margin: '20px auto',
            maxWidth: '600px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#FAF0E4',
              color: '#C8822A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <AlertCircle size={22} />
          </div>
          <h3
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.2rem',
              color: '#1C1917',
              margin: '0 0 6px',
            }}
          >
            Devotional Experience Interruption
          </h3>
          <p style={{ color: '#6B635B', fontSize: '0.875rem', margin: '0 0 16px', lineHeight: 1.5 }}>
            A momentary disturbance occurred while loading this section. Your sacred session and cart remain safe.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            style={{
              padding: '8px 18px',
              backgroundColor: '#1C1917',
              color: '#FAF7F2',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RotateCcw size={14} />
            <span>Reconnect Section</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
