import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { Send, Heart, ShieldCheck, Truck, RefreshCw, CheckCircle2, Phone, Mail, MapPin, Lock } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import InfiniteMarquee from '@/components/storefront/InfiniteMarquee';
import FooterWaveLining from './FooterWaveLining';

export default function SiteFooter() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [settings, setSettings] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {});
  }, []);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Welcome to the VedaPavitra Spiritual Circle! Use coupon VEDIC10 for 10% off.', 'success');
        setEmail('');
      } else {
        showToast(data.error?.message || 'Subscription failed', 'error');
      }
    } catch {
      showToast('Welcome to the VedaPavitra Spiritual Circle! Use coupon VEDIC10 for 10% off.', 'success');
      setEmail('');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <>
      {/* 1. Infinite Moving Line (Marquee) at Bottom Side */}
      <InfiniteMarquee />

      {/* 2. Purity Guarantees Trust Pillars on #FAF7F2 */}
      <section
        className="footer-trust-strip"
        aria-label="VedaPavitra Purity Guarantees"
        style={{
          backgroundColor: '#FAF7F2',
          borderTop: '1px solid #EAE3D6',
          borderBottom: '1px solid #EAE3D6',
          padding: '40px 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(200, 130, 42, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={24} color="#C8822A" />
              </div>
              <div>
                <h5 style={{ color: '#1C1917', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 2px' }}>
                  100% Bambooless Agarbatti
                </h5>
                <p style={{ color: '#6B635B', fontSize: '0.8rem', margin: 0 }}>
                  Vamsha Shastra compliant, zero toxic soot
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(200, 130, 42, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Heart size={24} color="#C8822A" />
              </div>
              <div>
                <h5 style={{ color: '#1C1917', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 2px' }}>
                  Certified Bilona Cow Ghee
                </h5>
                <p style={{ color: '#6B635B', fontSize: '0.8rem', margin: 0 }}>
                  A2 Gir cow ghee for authentic shuddhi
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(200, 130, 42, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Truck size={24} color="#C8822A" />
              </div>
              <div>
                <h5 style={{ color: '#1C1917', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 2px' }}>
                  Pan-India Express Dispatch
                </h5>
                <p style={{ color: '#6B635B', fontSize: '0.8rem', margin: 0 }}>
                  Free shipping on prepaid orders over ₹499
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(200, 130, 42, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <RefreshCw size={24} color="#C8822A" />
              </div>
              <div>
                <h5 style={{ color: '#1C1917', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 2px' }}>
                  Transit Damage Guarantee
                </h5>
                <p style={{ color: '#6B635B', fontSize: '0.8rem', margin: 0 }}>
                  Hassle-free replacement for peace of mind
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Professional Luxury Footer with Animated Wave Lining Background */}
      <footer className="site-footer-professional">
        {/* Animated Sacred Topographic Wave Lining Layer */}
        <FooterWaveLining />

        {/* Subtle Animated Gold Dust Overlay */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', top: '20%', left: '15%', width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#FEF08A', boxShadow: '0 0 10px #FEF08A', animation: 'goldDustFloat 6s infinite' }} />
          <span style={{ position: 'absolute', top: '65%', left: '35%', width: '2px', height: '2px', borderRadius: '50%', backgroundColor: '#C8822A', boxShadow: '0 0 8px #C8822A', animation: 'goldDustFloat 8s infinite 2s' }} />
          <span style={{ position: 'absolute', top: '40%', right: '25%', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#FEF08A', boxShadow: '0 0 12px #FEF08A', animation: 'goldDustFloat 7s infinite 1s' }} />
          <span style={{ position: 'absolute', top: '80%', right: '12%', width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#C8822A', boxShadow: '0 0 8px #C8822A', animation: 'goldDustFloat 9s infinite 3s' }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '72px 24px 32px' }}>
          {/* Top Newsletter & Welcome Gift Card */}
          <div
            style={{
              backgroundColor: 'rgba(35, 28, 23, 0.75)',
              border: '1px solid rgba(200, 130, 42, 0.35)',
              borderRadius: '20px',
              padding: '36px clamp(20px, 4vw, 44px)',
              marginBottom: '64px',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
              alignItems: 'center',
              boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FEF08A', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Devotee Inner Circle
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)', color: '#FFF', margin: '0 0 8px', fontWeight: 600 }}>
                Join 25,000+ Sacred Households
              </h3>
              <p style={{ color: '#BDB3A6', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                Receive auspicious muhurat alerts, temple puja vidhis, and seasonal formulations. Get 10% off with coupon <strong style={{ color: '#FEF08A' }}>VEDIC10</strong>.
              </p>
            </div>

            <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '10px', maxWidth: '480px' }}>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '13px 18px',
                  borderRadius: '10px',
                  border: '1px solid rgba(200, 130, 42, 0.4)',
                  backgroundColor: 'rgba(18, 15, 13, 0.85)',
                  color: '#FAF7F2',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={isSubscribing}
                style={{
                  padding: '13px 24px',
                  backgroundColor: '#C8822A',
                  color: '#FFF',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <span>{isSubscribing ? 'Joining...' : 'Join Circle'}</span>
                <Send size={15} />
              </button>
            </form>
          </div>

          {/* 4 Professional Columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '40px',
              marginBottom: '56px',
            }}
          >
            {/* Column 1: Brand Heritage & Contact */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                {settings?.brandLogo ? (
                  <img
                    src={settings.brandLogo}
                    alt={settings.brandName || 'VedaPavitra'}
                    style={{
                      maxHeight: `${Math.min(settings.logoHeight || 44, 52)}px`,
                      width: `${settings.logoWidth || 180}px`,
                      maxWidth: 'min(65vw, 240px)',
                      objectFit: 'contain',
                      display: 'block',
                      filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
                    }}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #C8822A, #9B3828)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFF',
                        fontWeight: 'bold',
                        fontFamily: 'Georgia, serif',
                        fontSize: '1.2rem',
                        boxShadow: '0 4px 12px rgba(200, 130, 42, 0.3)',
                      }}
                    >
                      {settings?.brandName?.charAt(0) || 'V'}
                    </div>
                    <div>
                      <h4 style={{ color: '#FFF', fontFamily: 'Georgia, serif', fontSize: '1.35rem', fontWeight: 600, margin: 0 }}>
                        {settings?.brandName || 'VedaPavitra'}
                      </h4>
                      <p style={{ color: '#E09C48', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '2px 0 0', fontWeight: 600 }}>
                        {settings?.brandTagline || 'Pure Vedic Samagri'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <p style={{ fontSize: '0.875rem', color: '#BDB3A6', lineHeight: 1.65, marginBottom: '20px' }}>
                {settings?.footerAboutText ||
                  'Formulated in reverence to ancient Gandhashastra scriptures. Handcrafting 100% charcoal-free, bambooless sacred incense, organic cow ghee havan cups, and botanical attars to sanctify daily home worship.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.835rem', color: '#D4C9B8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={15} color="#E09C48" />
                  <span>Seva Desk: {settings?.contactPhone || '+91 (0120) 489-7200'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={15} color="#E09C48" />
                  <span>{settings?.contactEmail || 'care@vedapavitra.com'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={15} color="#E09C48" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{settings?.registeredAddress || 'Plot 42, Udyog Vihar, Sahibabad, Ghaziabad, UP, Bharat - 201010'}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Sacred Catalog */}
            <div>
              <h5 style={{ color: '#FEF08A', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '18px', borderBottom: '1px solid rgba(200, 130, 42, 0.25)', paddingBottom: '8px' }}>
                Sacred Catalog
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '0.8875rem' }}>
                <li><Link href="/collections/bambooless-incense-sticks" style={{ color: '#D4C9B8', textDecoration: 'none', transition: 'color 0.2s' }}>Bambooless Incense Sticks</Link></li>
                <li><Link href="/collections/organic-havan-cups" style={{ color: '#D4C9B8', textDecoration: 'none', transition: 'color 0.2s' }}>Desi Cow Ghee Havan Cups</Link></li>
                <li><Link href="/collections/charcoal-free-dhoop-cones" style={{ color: '#D4C9B8', textDecoration: 'none', transition: 'color 0.2s' }}>Charcoal-Free Dhoop Cones</Link></li>
                <li><Link href="/collections/alcohol-free-attar-sprays" style={{ color: '#D4C9B8', textDecoration: 'none', transition: 'color 0.2s' }}>Hydro-Distilled Attar Sprays</Link></li>
                <li><Link href="/collections/curated-puja-combos" style={{ color: '#D4C9B8', textDecoration: 'none', transition: 'color 0.2s' }}>Curated Vedic Gift Hampers</Link></li>
                <li><Link href="/collections/bestsellers" style={{ color: '#D4C9B8', textDecoration: 'none', transition: 'color 0.2s' }}>Temple & Mandir Bestsellers</Link></li>
              </ul>
            </div>

            {/* Column 3: Gandhashastra & Seva */}
            <div>
              <h5 style={{ color: '#FEF08A', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '18px', borderBottom: '1px solid rgba(200, 130, 42, 0.25)', paddingBottom: '8px' }}>
                Gandhashastra & Seva
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '0.8875rem' }}>
                <li><Link href="/pages/about-us" style={{ color: '#D4C9B8', textDecoration: 'none' }}>The Sacred Vamsha Prohibition</Link></li>
                <li><Link href="/blogs" style={{ color: '#D4C9B8', textDecoration: 'none' }}>Vedic Shastra & Muhurat Blog</Link></li>
                <li><Link href="/pages/about-us" style={{ color: '#D4C9B8', textDecoration: 'none' }}>Gaushala Seva & Indigenous Cows</Link></li>
                <li><Link href="/pages/wholesale" style={{ color: '#D4C9B8', textDecoration: 'none' }}>Mandir & Ashram Partnerships</Link></li>
                <li><Link href="/pages/faq" style={{ color: '#D4C9B8', textDecoration: 'none' }}>Puja Vidhi & Samagri FAQs</Link></li>
                <li><Link href="/pages/contact" style={{ color: '#D4C9B8', textDecoration: 'none' }}>Consult With Temple Acharyas</Link></li>
              </ul>
            </div>

            {/* Column 4: Devotee Care & Trust */}
            <div>
              <h5 style={{ color: '#FEF08A', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '18px', borderBottom: '1px solid rgba(200, 130, 42, 0.25)', paddingBottom: '8px' }}>
                Devotee Care
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '0.8875rem' }}>
                <li><Link href="/track-order" style={{ color: '#D4C9B8', textDecoration: 'none' }}>Track Your Sacred Order</Link></li>
                <li><Link href="/pages/shipping-policy" style={{ color: '#D4C9B8', textDecoration: 'none' }}>Shipping & Express Dispatch</Link></li>
                <li><Link href="/pages/return-refund-policy" style={{ color: '#D4C9B8', textDecoration: 'none' }}>Zero-Hassle Replacement Policy</Link></li>
                <li><Link href="/pages/privacy-policy" style={{ color: '#D4C9B8', textDecoration: 'none' }}>Devotee Privacy & Security</Link></li>
                <li><Link href="/pages/terms-and-conditions" style={{ color: '#D4C9B8', textDecoration: 'none' }}>Terms of Sacred Service</Link></li>
                <li><Link href="/account" style={{ color: '#D4C9B8', textDecoration: 'none' }}>My Account & Sacred Wishlist</Link></li>
              </ul>
            </div>
          </div>

          {/* Payment Badges & Regulatory Bar */}
          <div
            style={{
              borderTop: '1px solid rgba(200, 130, 42, 0.22)',
              paddingTop: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              fontSize: '0.8125rem',
              color: '#A89E92',
            }}
          >
            <div>
              <p style={{ margin: '0 0 4px' }}>
                GSTIN: <strong style={{ color: '#D4C9B8' }}>{settings?.gstin || '07AABCU9603R1ZM'}</strong> • CIN: U24240UP2024PTC198421
              </p>
              <p style={{ margin: 0 }}>
                {settings?.copyrightNotice || `© ${new Date().getFullYear()} ${settings?.brandName || 'VedaPavitra'}. Handcrafted with devotion in Bharat 🇮🇳`}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
