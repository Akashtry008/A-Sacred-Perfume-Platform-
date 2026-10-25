import React, { useState } from 'react';
import Link from '@/components/common/Link';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Email, 2: Enter Code & New Password, 3: Success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codePreview, setCodePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Send verification code to email
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || data.message || 'Could not send reset code');
      }

      setCodePreview(data.codePreview || '');
      setStep(2);
      showToast(data.message || 'Verification code sent to your email!', 'success');
    } catch (err) {
      setErrorMsg(err.message || 'Unable to find an account with that email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset password using verification code
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
          newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || data.message || 'Password reset failed');
      }

      setStep(3);
      showToast('Password reset successfully in your account!', 'success');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid verification code or expired code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '85vh', padding: '48px 0 88px' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '24px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt;{' '}
          <Link href="/account/login" style={{ color: '#1C1917' }}>Login</Link> &gt;{' '}
          <span>Reset Password</span>
        </div>

        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '16px',
            padding: '36px 32px',
            boxShadow: 'var(--shadow-card-classic)',
          }}
        >
          {/* Header Icon & Title */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#FAF0E4',
                color: '#C8822A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '1px solid rgba(200, 130, 42, 0.3)',
              }}
            >
              <KeyRound size={24} />
            </div>

            <h1 className="heading-display" style={{ fontSize: '1.9rem', margin: '0 0 8px', color: '#1C1917' }}>
              {step === 1 ? 'Reset Password' : step === 2 ? 'Enter Verification Code' : 'Password Updated!'}
            </h1>

            <p style={{ color: '#6B635B', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
              {step === 1 && 'Enter your registered email address to receive a secure 6-digit verification code.'}
              {step === 2 && `We sent a 6-digit code to ${email}. Enter it below along with your new password.`}
              {step === 3 && 'Your devotee account has been successfully updated with your new password.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                color: '#991B1B',
                fontSize: '0.85rem',
                marginBottom: '20px',
                lineHeight: 1.4,
              }}
            >
              <div>{errorMsg}</div>
              {errorMsg.toLowerCase().includes('no account') && (
                <div style={{ marginTop: '8px' }}>
                  <Link
                    href="/account/register"
                    style={{ color: '#C8822A', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Create a new account now &rarr;
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* STEP 1: Request Code */}
          {step === 1 && (
            <>
              <form onSubmit={handleRequestCode} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1C1917', marginBottom: '6px' }}>
                    Registered Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="#948A7F" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      placeholder="devotee@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 40px',
                        borderRadius: '8px',
                        border: '1px solid #D6CEBE',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-full"
                  style={{ padding: '12px 0', fontSize: '0.95rem' }}
                >
                  {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </form>

              {/* Demo Account Autofill Helper */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '12px 14px',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #EAE3D6',
                  borderRadius: '8px',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B635B', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Demo Accounts (Click to test reset flow)
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('customer@vedapavitra.com');
                      setErrorMsg('');
                    }}
                    style={{
                      background: '#FFF',
                      border: '1px solid #D6CEBE',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      color: '#44403C',
                    }}
                  >
                    Devotee: customer@vedapavitra.com
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@vedapavitra.com');
                      setErrorMsg('');
                    }}
                    style={{
                      background: '#FFF',
                      border: '1px solid #D6CEBE',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      color: '#44403C',
                    }}
                  >
                    Admin: admin@vedapavitra.com
                  </button>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: Enter Code & New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Code Preview Helper Banner */}
              {codePreview && (
                <div
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#FEF9EF',
                    border: '1px dashed #C8822A',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    color: '#8A5818',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Dispatched Code:</span>
                  <strong style={{ fontSize: '1.05rem', letterSpacing: '0.15em', color: '#C8822A' }}>
                    {codePreview}
                  </strong>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1C1917', marginBottom: '6px' }}>
                  6-Digit Verification Code *
                </label>
                <input
                  type="text"
                  name="code"
                  autoComplete="one-time-code"
                  required
                  maxLength={6}
                  placeholder="e.g. 582914"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #D6CEBE',
                    fontSize: '1.1rem',
                    letterSpacing: '0.2em',
                    textAlign: 'center',
                    fontWeight: 700,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1C1917', marginBottom: '6px' }}>
                  New Password * (Min 6 characters)
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#948A7F" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="password"
                    name="newPassword"
                    autoComplete="new-password"
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 40px',
                      borderRadius: '8px',
                      border: '1px solid #D6CEBE',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1C1917', marginBottom: '6px' }}>
                  Confirm New Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#948A7F" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 40px',
                      borderRadius: '8px',
                      border: '1px solid #D6CEBE',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-full"
                style={{ padding: '12px 0', fontSize: '0.95rem' }}
              >
                {isLoading ? 'Updating Password...' : 'Reset & Save Password'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8C827A',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                ← Resend code or change email
              </button>
            </form>
          )}

          {/* STEP 3: Success Screen */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <CheckCircle2 size={44} color="#16A34A" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#166534', fontSize: '0.95rem', fontWeight: 600, marginBottom: '20px' }}>
                Password changed successfully! You can now log into your account.
              </p>
              <Link href="/account/login" className="btn btn-primary btn-full" style={{ padding: '12px 0' }}>
                Proceed to Log In
              </Link>
            </div>
          )}

          {/* Footer Back Link */}
          {step !== 3 && (
            <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #F0EAE1', paddingTop: '16px' }}>
              <Link
                href="/account/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#6B635B',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
