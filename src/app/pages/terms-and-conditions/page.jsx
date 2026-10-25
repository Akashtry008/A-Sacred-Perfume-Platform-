import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { FileText, ShieldAlert, Scale, CheckCircle2 } from 'lucide-react';

export default function TermsAndConditionsPage() {
  const [dynamicPolicy, setDynamicPolicy] = useState('');

  useEffect(() => {
    fetch('/api/policies')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.policies?.termsAndConditions) {
          setDynamicPolicy(data.policies.termsAndConditions);
        }
      })
      .catch(() => {});
  }, []);
  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '40px 0 88px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>Terms & Conditions</span>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '36px' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C8822A', fontWeight: 600 }}>
            Legal Framework
          </span>
          <h1 className="heading-display" style={{ fontSize: '2.4rem', margin: '8px 0 12px', color: '#1C1917' }}>
            Terms & Conditions of Service
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.9rem' }}>
            Last revised: October 2026 • Governed under the laws of the Republic of India
          </p>
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
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or completing an order on this website (vedapavitra.com), you signify your unconditional assent to these Terms and Conditions. If you disagree with any portion of these terms, please refrain from using our e-commerce platform.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              2. Product Descriptions & Sacred Use
            </h2>
            <p>
              VedaPavitra crafts artisan wellness and devotional incense products inspired by Gandhashastra literature. All products are intended solely for aromatherapeutic, ceremonial, and religious pooja application:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li>Never ingest or consume incense sticks, havan cups, or dhoop cones internally.</li>
              <li>Always light incense in well-ventilated altar spaces on fireproof heat-resistant brass or ceramic holders.</li>
              <li>Keep burning incense out of the reach of unsupervised children and pets.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              3. Pricing, Taxes & Invoicing
            </h2>
            <p>
              All prices quoted on the website are displayed in <strong>Indian National Rupees (₹ / INR)</strong> and include applicable Goods & Services Tax (GST). We reserve the right to revise product pricing, packaging variants, and discount campaigns without prior notification.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              4. Coupons, Gift Offers & Abuse Prevention
            </h2>
            <p>
              Promotional voucher codes (such as <code>VEDIC10</code>, <code>FIRSTPOOJA</code>) are limited to one application per eligible cart session. Automated free gift offers (e.g. Complimentary Discovery Trial at ₹599+) are added by our cart engine based on genuine order thresholds and are non-transferable and non-convertible to cash.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              5. Intellectual Property
            </h2>
            <p>
              All trademarks, product descriptions, custom photography, brand styling, botanical formulation guides, and website architecture are the exclusive intellectual property of VedaPavitra. Unauthorized reproduction or commercial mirroring is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              6. Governing Law & Jurisdiction
            </h2>
            <p>
              These terms and any disputes arising out of contracts or commercial sales executed on this platform shall be governed exclusively by the laws of India, with courts in New Delhi / Ghaziabad holding exclusive territorial jurisdiction.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              7. Contact Information
            </h2>
            <p>
              Questions regarding these Terms of Service may be addressed to our legal desk at <a href="mailto:legal@vedapavitra.com" style={{ color: '#C8822A', textDecoration: 'underline' }}>legal@vedapavitra.com</a> or via post to:
            </p>
            <div style={{ backgroundColor: '#FAF7F2', padding: '16px 20px', borderRadius: '8px', border: '1px solid #EAE3D6', marginTop: '12px', fontSize: '0.875rem' }}>
              <strong>VedaPavitra Legal & Compliance</strong><br />
              Plot 42, Udyog Vihar, Sahibabad, Ghaziabad, UP - 201010, India<br />
              GSTIN: 07AABCU9603R1ZM
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
