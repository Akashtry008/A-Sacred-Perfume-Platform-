import React from 'react';

const MARQUEE_ITEMS = [
  '100% Bambooless Agarbatti',
  'Charcoal-Free & Non-Toxic',
  'Pure Mysore Sandalwood',
  'Certified Desi Cow Ghee',
  'Hydro-Distilled Attar Sprays',
  'Gandhashastra Formulated',
  'Zero Chemical Fixatives',
  'Pan-India Express Dispatch',
  'Eco-Friendly Vedic Packaging',
  'Empowering Indigenous Gaushalas',
];

export default function InfiniteMarquee() {
  return (
    <div
      className="infinite-marquee-wrapper"
      role="region"
      aria-label="VedaPavitra Purity Benchmarks Marquee"
      style={{
        backgroundColor: '#1C1917',
        color: '#FAF7F2',
        padding: '14px 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'relative',
        borderTop: '1px solid rgba(200, 130, 42, 0.35)',
        borderBottom: '1px solid rgba(200, 130, 42, 0.35)',
        boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
      }}
    >
      <div
        className="infinite-marquee-track"
        style={{
          display: 'inline-flex',
          width: 'max-content',
        }}
      >
        {/* Strip 1 */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '32px', paddingRight: '32px' }}>
          {MARQUEE_ITEMS.map((text, idx) => (
            <div
              key={`s1-${idx}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: idx % 2 === 0 ? '#FAF7F2' : '#FEF08A',
              }}
            >
              <span style={{ color: '#E09C48', fontSize: '1.2rem', lineHeight: 1 }}>✦</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Strip 2 (Exact duplicate for mathematically seamless wrap) */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '32px', paddingRight: '32px' }}>
          {MARQUEE_ITEMS.map((text, idx) => (
            <div
              key={`s2-${idx}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: idx % 2 === 0 ? '#FAF7F2' : '#FEF08A',
              }}
            >
              <span style={{ color: '#E09C48', fontSize: '1.2rem', lineHeight: 1 }}>✦</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
