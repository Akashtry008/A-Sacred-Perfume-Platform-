import React, { useState } from 'react';
import Link from '@/components/common/Link';
import { Building2, Package, Award, CheckCircle2, Phone, Mail, FileText, Send, ShieldCheck } from 'lucide-react';

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    businessType: 'temple',
    estimatedMonthlyQty: '100-500',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'wholesale',
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again or WhatsApp our bulk desk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '40px 0 88px' }}>
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>B2B & Temple Wholesale</span>
        </div>

        {/* Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
            color: '#FAF7F2',
            borderRadius: '16px',
            padding: '48px 40px',
            marginBottom: '48px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            border: '1px solid #C8822A40',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#E09C48',
                fontWeight: 600,
                marginBottom: '12px',
              }}
            >
              Institutional & Bulk Spiritual Supplies
            </span>
            <h1
              className="heading-display"
              style={{ fontSize: '2.5rem', margin: '0 0 16px', color: '#FAF7F2', lineHeight: 1.2 }}
            >
              Wholesale Vedic Fragrance for Temples, Ashrams & Wellness Boutiques
            </h1>
            <p style={{ color: '#D6D3D1', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Partner directly with our artisans. Source certified 100% bambooless agarbatti, authentic desi cow ghee havan cups, and pure sandalwood samagri at direct wholesale pricing with guaranteed GST invoicing.
            </p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#E09C48" />
                <span>Tiered volume discounts (Up to 45% off MRP)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#E09C48" />
                <span>Low Minimum Order Quantity (Just ₹5,000)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#E09C48" />
                <span>Pan-India B2B freight with insured dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of B2B */}
        <div className="grid-3" style={{ marginBottom: '48px', gap: '24px' }}>
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <Building2 size={32} color="#C8822A" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', color: '#1C1917' }}>
              Temples & Trust Sanctuaries
            </h3>
            <p style={{ color: '#6B635B', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Provide devotees with clean, non-toxic air. Zero charcoal soot ensures historic shrine murals, deity vigrahas, and marble sanctums remain spotless and soot-free.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <Award size={32} color="#C8822A" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', color: '#1C1917' }}>
              Yoga & Meditation Ashrams
            </h3>
            <p style={{ color: '#6B635B', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Designed for deep Pranayama and extended dhyana practices. Natural Mysore sandalwood and Kashmiri kesar calm the nervous system without respiratory tightness.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <Package size={32} color="#C8822A" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', color: '#1C1917' }}>
              Festive Corporate & Resellers
            </h3>
            <p style={{ color: '#6B635B', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Premium handcrafted wooden gift boxes, Diwali celebration packages, and custom branded spiritual hampers for corporate clients and eco-conscious retail stores.
            </p>
          </div>
        </div>

        {/* Form and Contact Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '36px',
            alignItems: 'start',
          }}
        >
          {/* Inquiry Form */}
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '16px',
              border: '1px solid #EAE3D6',
              padding: '36px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            }}
          >
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.65rem', marginBottom: '8px', color: '#1C1917' }}>
              Request Wholesale Catalog & Quotation
            </h2>
            <p style={{ color: '#6B635B', fontSize: '0.875rem', marginBottom: '24px' }}>
              Fill in your organization details below. Our institutional trade team will reply within 4 business hours with our complete wholesale pricing matrix.
            </p>

            {submitted ? (
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '12px',
                  padding: '32px 24px',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={48} color="#16A34A" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ color: '#166534', fontSize: '1.35rem', marginBottom: '8px' }}>
                  Inquiry Received With Gratitude!
                </h3>
                <p style={{ color: '#14532D', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 20px' }}>
                  Our wholesale manager has received your details and will send our official wholesale catalog and volume discount schedule to <strong>{formData.email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      organization: '',
                      email: '',
                      phone: '',
                      city: '',
                      state: '',
                      businessType: 'temple',
                      estimatedMonthlyQty: '100-500',
                      message: '',
                    });
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.875rem' }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {errorMsg && (
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FCA5A5',
                      color: '#B91C1C',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Pt. Ramesh Sharma"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                      Organization / Temple / Business *
                    </label>
                    <input
                      type="text"
                      name="organization"
                      required
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="e.g. Shri Krishna Mandir Trust"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="trust@example.org"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Varanasi"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Uttar Pradesh"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                      Type of Organization
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.875rem',
                        backgroundColor: '#FFF',
                      }}
                    >
                      <option value="temple">Temple / Religious Trust</option>
                      <option value="ashram">Yoga / Meditation Ashram</option>
                      <option value="retail">Spiritual & Puja Retail Store</option>
                      <option value="corporate">Corporate Festive Gifting</option>
                      <option value="exporter">Export / International Distributor</option>
                      <option value="other">Other Commercial Entity</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                      Estimated Monthly Quantity
                    </label>
                    <select
                      name="estimatedMonthlyQty"
                      value={formData.estimatedMonthlyQty}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.875rem',
                        backgroundColor: '#FFF',
                      }}
                    >
                      <option value="sample">Sample Pack Trial (Under 50 units)</option>
                      <option value="50-100">50 - 100 units / month</option>
                      <option value="100-500">100 - 500 units / month</option>
                      <option value="500-2000">500 - 2,000 units / month</option>
                      <option value="2000+">Bulk Master Cartons (2,000+ units)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#44403C', marginBottom: '6px' }}>
                    Specific Products or Custom Requirements
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us which fragrances, pack sizes (e.g. 50-stick or 100-stick temple packs), or customized packaging you require..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '14px',
                    fontSize: '0.95rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Send size={18} />
                  {isSubmitting ? 'Submitting Details...' : 'Submit Wholesale Inquiry'}
                </button>
              </form>
            )}
          </div>

          {/* Direct Support & Trust Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                backgroundColor: '#FFF',
                borderRadius: '16px',
                border: '1px solid #EAE3D6',
                padding: '28px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '16px', color: '#1C1917' }}>
                Direct B2B Desk
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <a
                  href="tel:+919876543210"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#1C1917',
                    textDecoration: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#FAF7F2',
                  }}
                >
                  <Phone size={20} color="#C8822A" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6B635B' }}>Call Wholesale Desk</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>+91 98765 43210</div>
                  </div>
                </a>

                <a
                  href="mailto:wholesale@vedapavitra.com"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#1C1917',
                    textDecoration: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#FAF7F2',
                  }}
                >
                  <Mail size={20} color="#C8822A" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6B635B' }}>Email Institutional Sales</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>wholesale@vedapavitra.com</div>
                  </div>
                </a>

                <a
                  href="https://wa.me/919876543210?text=Namaste%20VedaPavitra,%20I%20would%20like%20to%20inquire%20about%20temple%20and%20wholesale%20orders."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#166534',
                    textDecoration: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#DCFCE7',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  <CheckCircle2 size={20} color="#166534" />
                  <span>Instant B2B Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#FFF',
                borderRadius: '16px',
                border: '1px solid #EAE3D6',
                padding: '28px',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '16px', color: '#1C1917' }}>
                Wholesale FAQs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#1C1917', marginBottom: '2px' }}>
                    What is the minimum order value?
                  </div>
                  <div style={{ color: '#6B635B' }}>
                    Wholesale pricing starts at an introductory order of just ₹5,000 for verified temples and businesses.
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1C1917', marginBottom: '2px' }}>
                    Do you provide GST invoices?
                  </div>
                  <div style={{ color: '#6B635B' }}>
                    Yes, 100% of our B2B dispatches include official tax invoices with full GST input credit availability.
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1C1917', marginBottom: '2px' }}>
                    Can we customize fragrance blends?
                  </div>
                  <div style={{ color: '#6B635B' }}>
                    For orders of 500+ packs, our master Gandhacharyas can formulate custom sacred temple blends.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
