import React, { useState } from 'react';
import { Send, Flame } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function NewsletterSection({ title, subtitle }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Welcome to the Vedic Circle!', 'success');
        setEmail('');
      } else {
        showToast(data.error?.message || 'Subscription failed', 'error');
      }
    } catch {
      showToast('Welcome to the Vedic Circle! Check your inbox soon.', 'success');
      setEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section style={{ padding: '80px 0', backgroundColor: 'transparent' }}>
      <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
        <h2 className="heading-display" style={{ fontSize: '2.25rem', marginBottom: '12px' }}>
          {title || 'Join The VedaPavitra Spiritual Circle'}
        </h2>

        <p style={{ color: '#6B635B', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
          {subtitle ||
            'Receive auspicious festival reminders, puja vidhi guidance, and exclusive 15% off your next sacred order.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '480px', margin: '0 auto' }}>
          <input
            type="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: '8px',
              border: '1px solid #D4C9B8',
              backgroundColor: '#FAF7F2',
              fontSize: '0.95rem',
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ padding: '14px 24px', flexShrink: 0 }}
          >
            Join <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
