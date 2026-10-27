import React from 'react';
import Link from '@/components/common/Link';
import { ArrowRight, Flame, Tag } from 'lucide-react';

export default function SeasonalBannerStrip({ banners }) {
  if (!banners || banners.length === 0) return null;

  // Find the first active banner, or use first banner
  const activeBanner = banners.find((b) => b.isActive !== false) || banners[0];
  if (!activeBanner) return null;

  const fallbackImage = 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1920&q=80';
  const bannerImg = activeBanner.imageUrl || activeBanner.image || fallbackImage;

  return (
    <section
      className="seasonal-banner-strip-section"
      style={{
        padding: '48px 0',
        backgroundColor: 'transparent',
      }}
      aria-label="Seasonal Offer & Festival Banner"
    >
      <div className="container">
        <div
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            minHeight: '340px',
            boxShadow: '0 16px 48px -8px rgba(28, 25, 23, 0.25)',
            border: '1.5px solid rgba(200, 130, 42, 0.45)',
            backgroundColor: '#1C1917',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Panoramic Background Media (Image or Video) */}
          {activeBanner.mediaType === 'video' || activeBanner.videoUrl ? (
            <video
              src={activeBanner.videoUrl}
              poster={bannerImg}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                filter: 'brightness(0.85)',
              }}
            />
          ) : (
            <img
              src={bannerImg}
              alt={activeBanner.heading || 'Seasonal Festive Samagri'}
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                filter: 'brightness(0.85)',
              }}
            />
          )}

          {/* Devotional Gradient Overlay for text clarity */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(20, 18, 16, 0.94) 0%, rgba(20, 18, 16, 0.82) 48%, rgba(20, 18, 16, 0.35) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Golden ornamental corner aura */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200, 130, 42, 0.35) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Content Body */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              padding: 'clamp(28px, 5vw, 54px)',
              maxWidth: '680px',
              color: '#FAF7F2',
            }}
          >
            {activeBanner.badge && (
              <div
                style={{
                  color: '#FCD34D',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                {activeBanner.badge}
              </div>
            )}

            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.75rem, 3.2vw, 2.4rem)',
                lineHeight: 1.25,
                margin: '0 0 12px',
                color: '#FFF',
                fontWeight: 700,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {activeBanner.heading || 'Auspicious Sacred Offer'}
            </h2>

            {activeBanner.subheading && (
              <p
                style={{
                  fontSize: 'clamp(0.92rem, 1.4vw, 1.05rem)',
                  lineHeight: 1.6,
                  color: '#E7DEC8',
                  margin: '0 0 20px',
                  textShadow: '0 1px 6px rgba(0,0,0,0.4)',
                }}
              >
                {activeBanner.subheading}
              </p>
            )}

            {(activeBanner.offerPrice || activeBanner.validUntil) && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '22px' }}>
                {activeBanner.offerPrice && (
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#1C1917',
                      backgroundColor: '#FEF08A',
                      padding: '4px 12px',
                      borderRadius: '6px',
                    }}
                  >
                    🏷️ {activeBanner.offerPrice}
                  </span>
                )}
                {activeBanner.validUntil && (
                  <span style={{ fontSize: '0.8rem', color: '#FCD34D', fontWeight: 600 }}>
                    ⏳ {activeBanner.validUntil}
                  </span>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                href={activeBanner.ctaLink || '/collections/bestsellers'}
                className="btn btn-primary"
                style={{
                  padding: '12px 28px',
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '8px',
                  boxShadow: '0 6px 20px rgba(200, 130, 42, 0.45)',
                }}
              >
                <span>{activeBanner.ctaText || 'Explore Sacred Offer'}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
