import React, { useState } from 'react';
import Link from '@/components/common/Link';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');

      if (!res.ok) {
        throw new Error(data.detail || data.error || data.message || 'Failed to authenticate');
      }

      if (data.token) {
        localStorage.setItem('vedapavitra_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('vedapavitra_user', JSON.stringify(data.user));
      }

      showToast?.('Welcome back! Signed in successfully.', 'success');
      if (redirect) {
        navigate(redirect);
      } else if (data.user?.role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '85vh', padding: '48px 0 88px' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '24px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>Devotee Login</span>
        </div>

        {/* Login Card */}
        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '16px',
            padding: '40px 32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#C8822A',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              Sacred Member Portal
            </span>
            <h1 className="heading-display" style={{ fontSize: '2.1rem', margin: 0, color: '#1C1917' }}>
              Sign In to VedaPavitra
            </h1>
            <p style={{ color: '#6B635B', fontSize: '0.875rem', marginTop: '8px' }}>
              Access your order history, saved addresses, and sacred ritual rewards.
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#B91C1C',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="#A8A29E"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  name="email"
                  autoComplete="username email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#44403C' }}>
                  Password
                </label>
                <Link
                  href="/account/forgot-password"
                  style={{ fontSize: '0.78rem', color: '#C8822A', textDecoration: 'none', fontWeight: 500 }}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="#A8A29E"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.95rem',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              <LogIn size={18} />
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Login Credentials */}
          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid #F5F1EB',
              backgroundColor: '#FAF7F2',
              padding: '16px',
              borderRadius: '8px',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B635B', marginBottom: '8px', textTransform: 'uppercase' }}>
              Quick Demo Logins (Click to autofill)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('customer@vedapavitra.com', 'vedic123')}
                style={{
                  background: '#FFF',
                  border: '1px solid #EAE3D6',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                  color: '#44403C',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span><strong>Customer:</strong> customer@vedapavitra.com</span>
                <span style={{ color: '#C8822A', fontSize: '0.75rem' }}>Auto-Fill</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin@vedapavitra.com', 'admin123')}
                style={{
                  background: '#FFF',
                  border: '1px solid #EAE3D6',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                  color: '#44403C',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span><strong>Store Admin:</strong> admin@vedapavitra.com</span>
                <span style={{ color: '#C8822A', fontSize: '0.75rem' }}>Auto-Fill</span>
              </button>
            </div>
          </div>

          {/* New Customer Registration CTA */}
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: '#6B635B' }}>
            New to VedaPavitra?{' '}
            <Link
              href="/account/register"
              style={{ color: '#C8822A', fontWeight: 600, textDecoration: 'none' }}
            >
              Create an account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
