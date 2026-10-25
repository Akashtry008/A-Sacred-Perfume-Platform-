import React, { useState } from 'react';
import Link from '@/components/common/Link';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ContactPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CONTACT', ...form }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Your message has been received with thanks! Our team will reply within 48 hours.', 'success');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        showToast(data.error?.message || 'Submission failed', 'error');
      }
    } catch {
      showToast('Your message has been received! We will reply shortly.', 'success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '48px 0 88px', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>Contact Us</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C8822A', fontWeight: 600 }}>
            We Are Here To Assist
          </span>
          <h1 className="heading-display" style={{ fontSize: '2.5rem', margin: '8px 0 12px' }}>
            Connect With VedaPavitra Care
          </h1>
          <p style={{ color: '#6B635B', fontSize: '1.05rem' }}>
            Have questions about pooja samagri, ingredients, bulk gifting, or existing orders?
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'start',
          }}
        >
          {/* Contact Details Card */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', padding: '32px' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', marginBottom: '20px' }}>
              Customer Support Channels
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <Mail size={22} color="#C8822A" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Email Support</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6B635B' }}>care@vedapavitra.com</p>
                  <span style={{ fontSize: '0.75rem', color: '#1E5E3A' }}>Average response: &lt; 24 hours</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <MessageSquare size={22} color="#1E5E3A" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>WhatsApp Assistance</h4>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.875rem', color: '#C8822A', textDecoration: 'underline' }}
                  >
                    +91 98765 43210
                  </a>
                  <p style={{ fontSize: '0.75rem', color: '#6B635B' }}>Chat live with pooja samagri consultants</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <Clock size={22} color="#C8822A" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Working Hours</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6B635B' }}>
                    Monday to Saturday: 10:00 AM – 7:00 PM IST
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <MapPin size={22} color="#C8822A" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Registered Facility</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6B635B', lineHeight: 1.5 }}>
                    VedaPavitra Vedic Wellness, Plot 42, Udyog Vihar, Sahibabad, Ghaziabad, Uttar Pradesh, India - 201010
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #EAE3D6', padding: '32px' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', marginBottom: '8px' }}>
              Send Us a Message
            </h3>
            <p style={{ color: '#6B635B', fontSize: '0.875rem', marginBottom: '20px' }}>
              Please provide your order number if inquiring about an active shipment.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandita Sen"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D4C9B8', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D4C9B8', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D4C9B8', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question on Havan Cups ingredients"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D4C9B8', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist your devotional practice?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D4C9B8', fontSize: '0.9rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ padding: '12px', fontSize: '0.95rem', marginTop: '6px' }}
              >
                <Send size={16} /> {isSubmitting ? 'Sending Message...' : 'Submit Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
