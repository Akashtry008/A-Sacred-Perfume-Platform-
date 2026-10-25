import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { ShieldCheck, Lock, EyeOff, Server, FileCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [dynamicPolicy, setDynamicPolicy] = useState('');

  useEffect(() => {
    fetch('/api/policies')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.policies?.privacyPolicy) {
          setDynamicPolicy(data.policies.privacyPolicy);
        }
      })
      .catch(() => {});
  }, []);
  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '40px 0 88px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>Privacy Policy</span>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '36px' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C8822A', fontWeight: 600 }}>
            Security & Trust
          </span>
          <h1 className="heading-display" style={{ fontSize: '2.4rem', margin: '8px 0 12px', color: '#1C1917' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.9rem' }}>
            Last revised: October 2026 • Compliant with Information Technology Act, 2000 & Digital Personal Data Protection Act
          </p>
        </div>

        {/* Highlight Card */}
        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <ShieldCheck size={36} color="#16A34A" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
              Your Spiritual Privacy Is Sacrosanct
            </h3>
            <p style={{ color: '#6B635B', fontSize: '0.875rem', margin: 0 }}>
              We never sell, rent, or trade your personal details, phone numbers, or order histories to advertising brokers or third-party marketing companies.
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '16px',
            padding: '40px',
            lineHeight: 1.8,
            color: '#332E2B',
            fontSize: '0.95rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}
        >
          {dynamicPolicy && (
            <div style={{ padding: '20px 24px', backgroundColor: '#FAF7F2', borderRadius: '10px', borderLeft: '4px solid #C8822A', whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#292524' }}>
              {dynamicPolicy}
            </div>
          )}

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              1. Information We Collect
            </h2>
            <p>
              When you visit or place an order on VedaPavitra, we collect only the necessary information required to fulfil your order and provide seamless customer seva:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li><strong>Contact Information:</strong> Full name, shipping destination address, mobile phone number, and email address.</li>
              <li><strong>Transaction Data:</strong> Ordered products, order timestamp, and payment status. <em>(Note: We never view or store sensitive debit/credit card numbers or CVV codes on our servers.)</em></li>
              <li><strong>Technical Metadata:</strong> IP address, device browser type, and cookie identifiers to maintain active cart state.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              2. How We Utilize Your Information
            </h2>
            <ul style={{ paddingLeft: '20px' }}>
              <li>To dispatch packages and share automated SMS/WhatsApp dispatch tracking updates.</li>
              <li>To prevent fraudulent payments, duplicate orders, and unauthorized account access.</li>
              <li>To send our weekly Vedic wisdom newsletter (only if you deliberately opt in, with single-click unsubscribe).</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              3. Secure Payment Gateway & Banking Privacy
            </h2>
            <p>
              All online payments on VedaPavitra are processed through <strong>Razorpay</strong>, India&apos;s PCI-DSS Level 1 compliant payment processor. All payment data is tokenized using 256-bit TLS bank-grade encryption directly between your browser and the card issuing bank.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              4. Cookies and Session State
            </h2>
            <p>
              We use minimal local cookies and session tokens exclusively to remember your cart items, guest checkout progress, and recently viewed incense blends. We do not employ third-party tracking pixels that follow you across the internet.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              5. Grievance Officer
            </h2>
            <p>
              In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of our Grievance Officer are:
            </p>
            <div style={{ backgroundColor: '#FAF7F2', padding: '16px 20px', borderRadius: '8px', border: '1px solid #EAE3D6', marginTop: '12px', fontSize: '0.875rem' }}>
              <div><strong>Grievance Officer:</strong> Priyadarshi Joshi</div>
              <div><strong>Email:</strong> grievance@vedapavitra.com</div>
              <div><strong>Address:</strong> VedaPavitra Wellness, Plot 42, Udyog Vihar, Sahibabad, Ghaziabad, UP - 201010</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
