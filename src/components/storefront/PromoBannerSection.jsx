import React, { useState } from 'react';
import Link from '@/components/common/Link';
import { Gift, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function PromoBannerSection({ content, hampers }) {
  if (!content && (!hampers || hampers.length === 0)) return null;

  const rawList = (Array.isArray(hampers) && hampers.length > 0)
    ? hampers
    : (Array.isArray(content?.hampers) && content.hampers.length > 0
        ? content.hampers
        : (content ? [content] : []));

  const validHampers = rawList.filter((h) => h && h.isActive !== false);
  const hampersList = validHampers.length > 0 ? validHampers : rawList;

  if (hampersList.length === 0) return null;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeHamper = hampersList[selectedIndex] || hampersList[0] || {};

  const features = activeHamper.features && activeHamper.features.length > 0
    ? activeHamper.features
    : [
        '40x Mysore Sandalwood Sticks',
        '12x Cow Ghee Havan Cups',
        'Solid Brass Diya Included',
      ];

  return (
    <section style={{ padding: '80px 0' }} aria-label="Festive Promotion">
      <div className="container">
        {/* Multi-Hamper Selector Tabs (if more than 1 hamper configured) */}
        {hampersList.length > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '24px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '0.8125rem', color: '#78716C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Explore Sacred Hampers:
            </span>
            {hampersList.map((h, i) => {
              const isSelected = i === selectedIndex;
              return (
                <button
                  key={h.id || i}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '24px',
                    border: isSelected ? '1.5px solid #C8822A' : '1px solid #EAE3D6',
                    backgroundColor: isSelected ? '#C8822A' : '#FFF',
                    color: isSelected ? '#FFF' : '#44403C',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(200, 130, 42, 0.25)' : 'none',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Gift size={14} color={isSelected ? '#FEF08A' : '#C8822A'} />
                  <span>{h.heading?.slice(0, 26) || `Hamper #${i + 1}`}</span>
                  <span style={{ opacity: 0.85, fontSize: '0.75rem' }}>({h.price || '₹999'})</span>
                </button>
              );
            })}
          </div>
        )}

        <div
          style={{
            background: 'linear-gradient(145deg, #1A1715 0%, #26201B 100%)',
            borderRadius: '20px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            color: '#FAF7F2',
            boxShadow: '0 24px 60px -12px rgba(28, 25, 23, 0.35)',
            border: '1.5px solid rgba(200, 130, 42, 0.4)',
            minHeight: 'auto',
            alignItems: 'stretch',
          }}
        >
          {/* Content side */}
          <div
            style={{
              padding: 'clamp(36px, 5vw, 64px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#E09C48',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '16px',
              }}
            >
              {activeHamper.badge || 'Sacred Festive Gifting Hamper'}
            </div>

            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(2rem, 3.4vw, 2.75rem)',
                lineHeight: 1.2,
                margin: '0 0 18px',
                color: '#FAF7F2',
                fontWeight: 700,
              }}
            >
              {activeHamper.heading || 'The Sampoorna Vedic Puja Hamper'}
            </h2>

            <p style={{ color: '#D8CEBF', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 32px', maxWidth: '540px' }}>
              {activeHamper.subheading ||
                'A grand, sacred monthly assortment of Pure Royal Mysore Sandalwood Agarbatti, Gir Cow Ghee Havan Cups, Kashmiri Kesar Chandan Dhoop, and a Handcrafted Heavy Solid Brass Diya.'}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '36px' }}>
              {features.map((feat, fIdx) => (
                <div
                  key={fIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.875rem',
                    color: '#FAF7F2',
                    backgroundColor: 'rgba(200, 130, 42, 0.15)',
                    padding: '8px 16px',
                    borderRadius: '24px',
                    border: '1px solid rgba(200, 130, 42, 0.35)',
                  }}
                >
                  <CheckCircle2 size={16} color="#E09C48" /> {feat}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FCD34D' }}>
                  {activeHamper.price || '₹999'}
                </span>
                {activeHamper.comparePrice && (
                  <span style={{ fontSize: '1.2rem', color: '#A8A29E', textDecoration: 'line-through' }}>
                    {activeHamper.comparePrice}
                  </span>
                )}
                <span
                  style={{
                    backgroundColor: '#15803D',
                    color: '#FFF',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    letterSpacing: '0.04em',
                  }}
                >
                  SPECIAL VALUE
                </span>
              </div>

              <Link
                href={activeHamper.ctaLink || '/products/sampoorna-vedic-daily-puja-combo-box'}
                className="btn-primary"
                style={{
                  fontSize: '1.05rem',
                  padding: '14px 32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 6px 20px rgba(200, 130, 42, 0.45)',
                  borderRadius: '10px',
                }}
              >
                {activeHamper.ctaText || 'Claim Festive Hamper'} <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Image side - Grand square-sized presentation */}
          <div
            style={{
              position: 'relative',
              minHeight: 'clamp(280px, 42vw, 480px)',
              backgroundColor: '#141210',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {activeHamper.mediaType === 'video' || activeHamper.videoUrl ? (
              <video
                src={activeHamper.videoUrl}
                poster={activeHamper.imageUrl || activeHamper.image}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                }}
              />
            ) : (
              <img
                src={activeHamper.imageUrl || activeHamper.image || 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80'}
                alt={activeHamper.heading || "Sampoorna Vedic Puja Hamper"}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80';
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                }}
              />
            )}

            {/* Subtle sacred warm inner gradient overlay for text readability without obscuring hamper photo */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(26, 23, 21, 0.25) 0%, transparent 25%), linear-gradient(to top, rgba(26, 23, 21, 0.5) 0%, transparent 35%)',
                pointerEvents: 'none',
              }}
            />

            {/* Floating Luxury Highlight Card */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                right: '24px',
                backgroundColor: 'rgba(28, 25, 23, 0.88)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(200, 130, 42, 0.5)',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: '#E09C48', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  ✦ Gandhashastra Certified
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FAF7F2' }}>
                  Handmade • Charcoal-Free • Pure Vedic Puja
                </div>
              </div>
              <div
                style={{
                  backgroundColor: '#C8822A',
                  color: '#FFF',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                4.9 ★ Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
