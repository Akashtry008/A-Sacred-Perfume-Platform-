import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export default function PhilosophySection({ title, content }) {
  return (
    <section style={{ padding: '80px 0', backgroundColor: 'transparent' }} aria-labelledby="philosophy-heading">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <p style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C8822A', fontWeight: 600, marginBottom: '6px' }}>
            Our Sacred Ethos
          </p>
          <h2 id="philosophy-heading" className="heading-display" style={{ fontSize: '2.25rem' }}>
            {title || 'Our Sacred Commitment to Purity & Gau Seva'}
          </h2>
        </div>

        <div className="grid-2">
          {/* Card 1: Purity */}
          <div
            style={{
              backgroundColor: '#FFF',
              padding: '36px',
              borderRadius: '12px',
              border: '1px solid #EAE3D6',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 130, 42, 0.12)',
                color: '#C8822A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <ShieldCheck size={26} />
            </div>

            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', marginBottom: '12px' }}>
              {content?.purityHeading || 'The Shuddhi Standard'}
            </h3>

            <p style={{ color: '#6B635B', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {content?.purityText ||
                'We never use sawdust, scrap charcoal, synthetic chemical fixatives, or bamboo core sticks. Every stick is molded with pure botanical oils and resins by traditional women artisans.'}
            </p>
          </div>

          {/* Card 2: Gau Seva */}
          <div
            style={{
              backgroundColor: '#FFF',
              padding: '36px',
              borderRadius: '12px',
              border: '1px solid #EAE3D6',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(155, 56, 40, 0.12)',
                color: '#9B3828',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <Heart size={26} />
            </div>

            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', marginBottom: '12px' }}>
              {content?.sevaHeading || 'A Commitment to Gau Mata'}
            </h3>

            <p style={{ color: '#6B635B', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {content?.sevaText ||
                'A designated portion of every single purchase directly sponsors organic fodder, shelter, and medical care for rescued indigenous cows at Gaushalas in Delhi NCR and Haryana.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
