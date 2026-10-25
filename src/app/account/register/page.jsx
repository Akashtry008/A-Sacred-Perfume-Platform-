import React, { useState } from 'react';
import Link from '@/components/common/Link';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Gift, Mail, Lock, Phone, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    agreeTerms: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      setErrorMsg('Please accept our terms and conditions to continue.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || data.error || 'Failed to create account');
      }

      if (data.token) {
        localStorage.setItem('vedapavitra_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('vedapavitra_user', JSON.stringify(data.user));
      }

      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');

      showToast?.(
        data.message || 'Sacred account created! Welcome blessing and introductory products sent to your email.',
        'success'
      );
      if (redirect) {
        navigate(redirect);
      } else {
        navigate('/account');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '85vh', padding: '48px 0 88px' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '24px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>Create Account</span>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '16px',
            padding: '40px 32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}
        >
          {/* Welcome Bonus Notice */}
          <div
            style={{
              backgroundColor: '#FAF0E4',
              border: '1px solid #E6CAAA',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <Gift size={20} color="#C8822A" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.8125rem', color: '#78350F' }}>
              <strong>New Devotee Bonus:</strong> Use code <code>VEDIC10</code> at checkout for 10% off your first puja order!
            </div>
          </div>

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
              Join Our Sacred Circle
            </span>
            <h1 className="heading-display" style={{ fontSize: '2.1rem', margin: 0, color: '#1C1917' }}>
              Create an Account
            </h1>
            <p style={{ color: '#6B635B', fontSize: '0.875rem', marginTop: '8px' }}>
              Track shipments, re-order your favorite temple fragrances, and receive sacred festival alerts.
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

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                  First Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={16}
                    color="#A8A29E"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Rohan"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '8px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Verma"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="#A8A29E"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rohan@example.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                Phone Number (For delivery updates)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone
                  size={16}
                  color="#A8A29E"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98112 23344"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                Set Password * (Minimum 6 characters)
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="#A8A29E"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '8px',
                    border: '1px solid #D6D3D1',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '4px' }}>
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                style={{ marginTop: '3px' }}
              />
              <label htmlFor="agreeTerms" style={{ fontSize: '0.78rem', color: '#6B635B', lineHeight: 1.5 }}>
                I agree to the{' '}
                <Link href="/pages/terms-and-conditions" style={{ color: '#C8822A', textDecoration: 'underline' }}>
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link href="/pages/privacy-policy" style={{ color: '#C8822A', textDecoration: 'underline' }}>
                  Privacy Policy
                </Link>.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.95rem',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              <UserPlus size={18} />
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          {/* Already have an account */}
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: '#6B635B' }}>
            Already a registered member?{' '}
            <Link
              href="/account/login"
              style={{ color: '#C8822A', fontWeight: 600, textDecoration: 'none' }}
            >
              Sign In &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
