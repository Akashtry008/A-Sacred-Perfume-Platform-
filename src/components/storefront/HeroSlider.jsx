import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';

export default function HeroSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slides]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 8, y: x * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  if (!slides || slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        backgroundColor: '#1C1917',
        color: '#FAF7F2',
        overflow: 'hidden',
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center',
        perspective: '1200px',
      }}
      aria-label="Featured Collections"
    >
      {/* Background Media (Image or Video) with Smooth Crossfade & Dark Vignette Overlay */}
      {slide.mediaType === 'video' || slide.videoUrl ? (
        <video
          key={slide.videoUrl || current}
          src={slide.videoUrl}
          poster={slide.desktopImage}
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
            opacity: 0.45,
            transition: 'opacity 0.8s ease-in-out',
            transform: `scale(1.05) translate(${tilt.y * 1.5}px, ${tilt.x * 1.5}px)`,
          }}
        />
      ) : (
        <div
          key={slide.desktopImage || current}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${slide.desktopImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.38,
            transition: 'all 0.8s ease-in-out',
            animation: 'fadeIn 0.8s ease-in-out',
            transform: `scale(1.05) translate(${tilt.y * 1.5}px, ${tilt.x * 1.5}px)`,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(28, 25, 23, 0.92) 0%, rgba(28, 25, 23, 0.65) 60%, rgba(28, 25, 23, 0.3) 100%)',
        }}
      />

      {/* Floating 3D Sacred Sparkles & Embers */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '25%',
            right: '18%',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#F59E0B',
            boxShadow: '0 0 16px #F59E0B',
            animation: 'pingRing 4s infinite',
            opacity: 0.6,
          }}
        />
        <span
          style={{
            position: 'absolute',
            bottom: '30%',
            right: '32%',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: '#FEF08A',
            boxShadow: '0 0 12px #FEF08A',
            animation: 'pingRing 3s infinite 1s',
            opacity: 0.5,
          }}
        />
      </div>

      {/* Content with 3D Depth */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '64px 24px',
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          {/* Circled badge removed as requested */}

          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              lineHeight: 1.15,
              fontWeight: 'normal',
              marginBottom: '18px',
              color: '#FFF',
              textShadow: '0 4px 20px rgba(0,0,0,0.4)',
              transform: 'translateZ(25px)',
            }}
          >
            {slide.heading}
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
              color: '#D4C9B8',
              lineHeight: 1.6,
              marginBottom: '32px',
              transform: 'translateZ(15px)',
            }}
          >
            {slide.subheading}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              transform: 'translateZ(30px)',
            }}
          >
            <Link
              href={slide.ctaLink}
              className="btn-primary"
              style={{ fontSize: '1rem', padding: '14px 28px' }}
            >
              {slide.ctaText}
            </Link>

            {slide.secondaryCtaText && (
              <Link
                href={slide.secondaryCtaLink}
                className="btn-secondary"
                style={{
                  fontSize: '1rem',
                  padding: '14px 28px',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  color: '#FFF',
                }}
              >
                {slide.secondaryCtaText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            gap: '8px',
          }}
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: current === idx ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: current === idx ? '#C8822A' : 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
