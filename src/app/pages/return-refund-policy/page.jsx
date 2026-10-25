import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertTriangle, MessageSquare, Mail } from 'lucide-react';

export default function ReturnRefundPolicyPage() {
  const [dynamicPolicy, setDynamicPolicy] = useState('');

  useEffect(() => {
    fetch('/api/policies')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.policies?.returnRefundPolicy) {
          setDynamicPolicy(data.policies.returnRefundPolicy);
        }
      })
      .catch(() => {});
  }, []);
  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '40px 0 88px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>Returns & Refund Policy</span>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '36px' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C8822A', fontWeight: 600 }}>
            Customer Satisfaction & Sacred Sanctity
          </span>
          <h1 className="heading-display" style={{ fontSize: '2.4rem', margin: '8px 0 12px', color: '#1C1917' }}>
            Returns & Refund Policy
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.9rem' }}>
            Last revised: October 2026 • Clear, transparent protection for every devotee
          </p>
        </div>

        {/* Summary Card */}
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
          <RotateCcw size={32} color="#C8822A" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1C1917', marginBottom: '4px' }}>
              100% Free Replacements for Transit Damage
            </h3>
            <p style={{ color: '#6B635B', fontSize: '0.875rem', margin: 0 }}>
              Because our items are consecrated for spiritual worship, opened packs cannot be returned for hygiene reasons. However, any damaged or incorrect product is replaced immediately at zero cost.
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
              1. The Sacred Sanctity Standard
            </h2>
            <p>
              In accordance with traditional Vedic Shastric tenets (Shaucha) and sanitary hygiene standards, items formulated for spiritual altar offerings, deity bathing, and havan oblations (including bambooless agarbatti, havan samagri cups, dhoop, and attar oils) cannot be returned or restocked once opened.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              2. Eligible Replacement Scenarios
            </h2>
            <p>
              You are entitled to a <strong>100% free re-dispatch replacement</strong> under the following circumstances:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li><strong>Damage in Transit:</strong> Outer box smashed, incense sticks broken, or havan cups crushed upon delivery.</li>
              <li><strong>Incorrect Product Sent:</strong> You received a different fragrance variant, pack size, or combo than ordered.</li>
              <li><strong>Manufacturing Defect:</strong> Defective brass stand, missing components in gift boxes, or leaky attar roller.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              3. Simple 3-Step Replacement Process
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '16px 0' }}>
              <div style={{ backgroundColor: '#FAF7F2', padding: '16px', borderRadius: '8px', border: '1px solid #EAE3D6' }}>
                <div style={{ fontWeight: 700, color: '#C8822A', marginBottom: '4px' }}>Step 1: Photograph</div>
                <div style={{ fontSize: '0.85rem', color: '#57534E' }}>Take a quick photo or short video clip of the damaged item & courier label.</div>
              </div>
              <div style={{ backgroundColor: '#FAF7F2', padding: '16px', borderRadius: '8px', border: '1px solid #EAE3D6' }}>
                <div style={{ fontWeight: 700, color: '#C8822A', marginBottom: '4px' }}>Step 2: WhatsApp / Email</div>
                <div style={{ fontSize: '0.85rem', color: '#57534E' }}>Share your Order ID and photo with our Care Desk within 7 days of delivery.</div>
              </div>
              <div style={{ backgroundColor: '#FAF7F2', padding: '16px', borderRadius: '8px', border: '1px solid #EAE3D6' }}>
                <div style={{ fontWeight: 700, color: '#C8822A', marginBottom: '4px' }}>Step 3: Fast Replacement</div>
                <div style={{ fontSize: '0.85rem', color: '#57534E' }}>We dispatch a brand-new pristine replacement within 24 hours via air courier.</div>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              4. Refunds & Reversal Timelines
            </h2>
            <p>
              If a product is permanently out of stock or if a replacement cannot be provided, we will initiate a full monetary refund:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li><strong>Prepaid Orders (UPI / Cards / Netbanking):</strong> Refund is credited directly to your original source account within <strong>3 to 5 business days</strong> after approval.</li>
              <li><strong>COD Orders:</strong> Refund is provided via instant UPI transfer or store credit voucher based on customer preference.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              5. Order Cancellations
            </h2>
            <p>
              You may cancel an order before it has been handed over to our courier partner (typically within 4 hours of placing the order). Once an order has been marked as <em>SHIPPED</em> and assigned an AWB tracking code, it cannot be recalled in transit.
            </p>
          </section>

          <div
            style={{
              backgroundColor: '#FAF7F2',
              borderRadius: '12px',
              border: '1px solid #EAE3D6',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: '#1C1917' }}>Have a question regarding your order?</div>
              <div style={{ fontSize: '0.875rem', color: '#6B635B' }}>Reach our customer seva specialists directly.</div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ fontSize: '0.8125rem' }}
              >
                WhatsApp Care Desk
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
