import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { Truck, Clock, ShieldCheck, MapPin, AlertCircle, HelpCircle } from 'lucide-react';

export default function ShippingPolicyPage() {
  const [dynamicPolicy, setDynamicPolicy] = useState('');

  useEffect(() => {
    fetch('/api/policies')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.policies?.shippingPolicy) {
          setDynamicPolicy(data.policies.shippingPolicy);
        }
      })
      .catch(() => {});
  }, []);
  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '40px 0 88px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>Shipping & Delivery Policy</span>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '36px' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C8822A', fontWeight: 600 }}>
            Orders & Transit
          </span>
          <h1 className="heading-display" style={{ fontSize: '2.4rem', margin: '8px 0 12px', color: '#1C1917' }}>
            Shipping & Delivery Policy
          </h1>
          <p style={{ color: '#6B635B', fontSize: '0.9rem' }}>
            Last revised: October 2026 • Effective across all orders placed on VedaPavitra
          </p>
        </div>

        {/* Highlight Banner */}
        <div
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '12px',
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Truck size={24} color="#C8822A" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1C1917' }}>Free Pan-India Delivery</div>
              <div style={{ color: '#6B635B', fontSize: '0.8125rem' }}>On all domestic orders valued at ₹499 and above.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Clock size={24} color="#C8822A" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1C1917' }}>24-48 Hr Dispatch</div>
              <div style={{ color: '#6B635B', fontSize: '0.8125rem' }}>Handcrafted and packed fresh from our sacred atelier.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <MapPin size={24} color="#C8822A" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1C1917' }}>19,000+ PIN Codes</div>
              <div style={{ color: '#6B635B', fontSize: '0.8125rem' }}>Full coverage via Delhivery, BlueDart & India Post.</div>
            </div>
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
              1. Dispatch Timelines
            </h2>
            <p>
              Every VedaPavitra package is treated with profound ritual reverence. Our botanical incense sticks and organic havan cups are carefully stored in temperature-controlled sacred chambers.
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li><strong>Standard Orders:</strong> Dispatched within 24 to 48 business hours after order confirmation.</li>
              <li><strong>Weekend / Gazetted Holidays:</strong> Orders placed on Sundays or national holidays are dispatched on the immediate following business day.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              2. Transit & Estimated Delivery Schedules
            </h2>
            <div style={{ overflowX: 'auto', margin: '16px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF7F2', textAlign: 'left', borderBottom: '2px solid #EAE3D6' }}>
                    <th style={{ padding: '12px' }}>Destination Region</th>
                    <th style={{ padding: '12px' }}>Carrier Partner</th>
                    <th style={{ padding: '12px' }}>Estimated Transit Window</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #EAE3D6' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>Delhi-NCR & Northern Hubs</td>
                    <td style={{ padding: '12px' }}>Delhivery Express / BlueDart Air</td>
                    <td style={{ padding: '12px' }}>1 – 2 Business Days</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #EAE3D6' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>Metros (Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Pune)</td>
                    <td style={{ padding: '12px' }}>BlueDart Air / Delhivery Air</td>
                    <td style={{ padding: '12px' }}>2 – 3 Business Days</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #EAE3D6' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>Tier 2 & Tier 3 Cities</td>
                    <td style={{ padding: '12px' }}>Delhivery Surface / DTDC</td>
                    <td style={{ padding: '12px' }}>3 – 5 Business Days</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', fontWeight: 600 }}>Northeast, Jammu & Kashmir, Rural PIN Codes</td>
                    <td style={{ padding: '12px' }}>Speed Post / Delhivery Priority</td>
                    <td style={{ padding: '12px' }}>5 – 7 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              3. Shipping Charges & Free Delivery Threshold
            </h2>
            <p>
              We believe pure spiritual worship should be universally accessible:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li><strong>Orders of ₹499 or higher:</strong> Enjoy <strong>100% FREE Standard Shipping</strong> anywhere in India.</li>
              <li><strong>Orders under ₹499:</strong> A nominal flat logistics fee of <strong>₹50</strong> is added at checkout to support express courier charges.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              4. Real-Time Tracking & Notifications
            </h2>
            <p>
              Once your sacred box leaves our fulfilment facility, you will automatically receive an SMS and Email notification containing your <strong>AWB Tracking Number</strong> and direct tracking URL link. You may also track any order directly on our website under your customer profile or by visiting our <Link href="/account/orders" style={{ color: '#C8822A', textDecoration: 'underline' }}>Orders Tracking Page</Link>.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              5. Delivery Attempts & Failed Deliveries
            </h2>
            <p>
              Our courier partners attempt delivery up to three (3) consecutive times. In the event of customer unavailability, wrong address coordinates, or phone unresponsiveness, the package may return to our origin hub. Re-dispatch requests in such cases may incur a secondary shipping surcharge of ₹50.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '12px' }}>
              6. Transit Damage or Missing Items
            </h2>
            <p>
              All our fragile havan cups and glass attar bottles are packed in multi-layered, shock-absorbing eco-cushioning. However, in the unlikely event of courier mishandling:
            </p>
            <p style={{ marginTop: '8px' }}>
              Please photograph the outer box and damaged item and send it via WhatsApp to <strong>+91 98765 43210</strong> or email <strong>care@vedapavitra.com</strong> within 48 hours of receipt. We will dispatch an immediate free replacement with no questions asked.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
