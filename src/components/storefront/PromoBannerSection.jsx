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
    <section style={{ padding: '20px 0' }} aria-label="Festive Promotion">
      <div className="container">
        {/* Multi-Hamper Selector Tabs (if more than 1 hamper configured) */}
        {hampersList.length > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: '#78716C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
                    padding: '4px 11px',
                    borderRadius: '16px',
                    border: isSelected ? '1.5px solid #C8822A' : '1px solid #EAE3D6',
                    backgroundColor: isSelected ? '#C8822A' : '#FFF',
                    color: isSelected ? '#FFF' : '#44403C',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 2px 6px rgba(200, 130, 42, 0.2)' : 'none',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Gift size={11} color={isSelected ? '#FEF08A' : '#C8822A'} />
                  <span>{h.heading?.slice(0, 22) || `Hamper #${i + 1}`}</span>
                  <span style={{ opacity: 0.85, fontSize: '0.68rem' }}>({h.price || '₹999'})</span>
                </button>
              );
            })}
          </div>
        )}

        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            background: 'linear-gradient(145deg, #1A1715 0%, #26201B 100%)',
            borderRadius: '14px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            color: '#FAF7F2',
            boxShadow: '0 10px 30px -8px rgba(28, 25, 23, 0.25)',
            border: '1.5px solid rgba(200, 130, 42, 0.35)',
            alignItems: 'stretch',
          }}
        >
          {/* Content side */}
          <div
            style={{
              padding: 'clamp(14px, 2vw, 22px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: '#E09C48',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '6px',
              }}
            >
              <Sparkles size={11} /> {activeHamper.badge || 'Sacred Festive Gifting Hamper'}
            </div>

            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.2rem, 1.7vw, 1.55rem)',
                lineHeight: 1.2,
                margin: '0 0 6px',
                color: '#FAF7F2',
                fontWeight: 700,
              }}
            >
              {activeHamper.heading || 'The Sampoorna Vedic Puja Hamper'}
            </h2>

            <p
              style={{
                color: '#D8CEBF',
                fontSize: '0.8rem',
                lineHeight: 1.45,
                margin: '0 0 10px',
                maxWidth: '460px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {activeHamper.subheading ||
                'A grand, sacred monthly assortment of Pure Royal Mysore Sandalwood Agarbatti, Gir Cow Ghee Havan Cups, Kashmiri Kesar Chandan Dhoop, and a Handcrafted Heavy Solid Brass Diya.'}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
              {features.map((feat, fIdx) => (
                <div
                  key={fIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.7rem',
                    color: '#FAF7F2',
                    backgroundColor: 'rgba(200, 130, 42, 0.15)',
                    padding: '3px 8px',
                    borderRadius: '14px',
                    border: '1px solid rgba(200, 130, 42, 0.35)',
                  }}
                >
                  <CheckCircle2 size={11} color="#E09C48" /> {feat}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FCD34D' }}>
                  {activeHamper.price || '₹999'}
                </span>
                {activeHamper.comparePrice && (
                  <span style={{ fontSize: '0.88rem', color: '#A8A29E', textDecoration: 'line-through' }}>
                    {activeHamper.comparePrice}
                  </span>
                )}
                <span
                  style={{
                    backgroundColor: '#15803D',
                    color: '#FFF',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
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
                  fontSize: '0.8rem',
                  padding: '7px 16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 3px 10px rgba(200, 130, 42, 0.3)',
                  borderRadius: '6px',
                }}
              >
                {activeHamper.ctaText || 'Claim Festive Hamper'} <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Image side - Sleek compact height presentation */}
          <div
            style={{
              position: 'relative',
              minHeight: 'clamp(150px, 16vw, 220px)',
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
                bottom: '12px',
                left: '12px',
                right: '12px',
                backgroundColor: 'rgba(28, 25, 23, 0.9)',
                backdropFilter: 'blur(8px)',
                borderRadius: '8px',
                border: '1px solid rgba(200, 130, 42, 0.45)',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.65rem', color: '#E09C48', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  ✦ Gandhashastra Certified
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FAF7F2' }}>
                  Handmade • Charcoal-Free • Pure Vedic Puja
                </div>
              </div>
              <div
                style={{
                  backgroundColor: '#C8822A',
                  color: '#FFF',
                  padding: '3px 8px',
                  borderRadius: '5px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
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
