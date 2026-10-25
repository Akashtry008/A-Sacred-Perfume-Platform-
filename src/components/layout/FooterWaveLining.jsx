import React from 'react';

/**
 * Animated Background Lining for Footer
 * Inspired by sacred Vedic Gandha smoke waves & golden sand dune contours.
 * Uses seamless repeating sinusoidal curves that drift infinitely.
 */
export default function FooterWaveLining() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.55,
      }}
      aria-hidden="true"
    >
      {/* Warm Golden Glow Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(200, 130, 42, 0.18) 0%, rgba(155, 56, 40, 0.08) 50%, transparent 80%)',
        }}
      />

      {/* Layer 1: Foreground Golden Flowing Wave Lines (Fast Drift) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '100%',
          animation: 'footerLiningDrift1 45s linear infinite',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 2880 700"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Ridge Wave 1 */}
          <path
            d="M 0,220 C 240,120 480,340 720,180 C 960,80 1200,300 1440,220 C 1680,120 1920,340 2160,180 C 2400,80 2640,300 2880,220"
            stroke="#C8822A"
            strokeWidth="1.5"
            strokeOpacity="0.75"
          />
          {/* Dashed Texture Line 1A */}
          <path
            d="M 0,235 C 240,135 480,355 720,195 C 960,95 1200,315 1440,235 C 1680,135 1920,355 2160,195 C 2400,95 2640,315 2880,235"
            stroke="#E09C48"
            strokeWidth="1"
            strokeDasharray="6 8"
            strokeOpacity="0.5"
          />

          {/* Crest Wave 2 */}
          <path
            d="M 0,380 C 200,260 520,490 720,340 C 920,200 1240,460 1440,380 C 1640,260 1960,490 2160,340 C 2360,200 2680,460 2880,380"
            stroke="#D9822B"
            strokeWidth="1.8"
            strokeOpacity="0.65"
          />
          {/* Secondary Dashed Ripple 2A */}
          <path
            d="M 0,395 C 200,275 520,505 720,355 C 920,215 1240,475 1440,395 C 1640,275 1960,505 2160,355 C 2360,215 2680,475 2880,395"
            stroke="#FEF08A"
            strokeWidth="1"
            strokeDasharray="4 6"
            strokeOpacity="0.45"
          />
          <path
            d="M 0,410 C 200,290 520,520 720,370 C 920,230 1240,490 1440,410 C 1640,290 1960,520 2160,370 C 2360,230 2680,490 2880,410"
            stroke="#C8822A"
            strokeWidth="0.75"
            strokeDasharray="2 8"
            strokeOpacity="0.35"
          />

          {/* Deep Base Dune Wave 3 */}
          <path
            d="M 0,540 C 280,420 540,640 720,500 C 980,380 1260,620 1440,540 C 1720,420 1980,640 2160,500 C 2420,380 2700,620 2880,540"
            stroke="#C8822A"
            strokeWidth="2"
            strokeOpacity="0.6"
          />
          <path
            d="M 0,555 C 280,435 540,655 720,515 C 980,395 1260,635 1440,555 C 1720,435 1980,655 2160,515 C 2420,395 2700,635 2880,555"
            stroke="#FEF08A"
            strokeWidth="1"
            strokeDasharray="8 6"
            strokeOpacity="0.4"
          />
        </svg>
      </div>

      {/* Layer 2: Counter-drifting Secondary Intersecting Waves (Slow Drift) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '100%',
          animation: 'footerLiningDrift2 65s linear infinite',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 2880 700"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Intersecting Dune Wave 4 */}
          <path
            d="M 0,290 C 360,420 600,160 720,270 C 960,400 1200,180 1440,290 C 1800,420 2040,160 2160,270 C 2400,400 2640,180 2880,290"
            stroke="#E09C48"
            strokeWidth="1.25"
            strokeOpacity="0.55"
          />
          <path
            d="M 0,305 C 360,435 600,175 720,285 C 960,415 1200,195 1440,305 C 1800,435 2040,175 2160,285 C 2400,415 2640,195 2880,305"
            stroke="#C8822A"
            strokeWidth="0.8"
            strokeDasharray="5 7"
            strokeOpacity="0.35"
          />

          {/* Intersecting Wave 5 */}
          <path
            d="M 0,460 C 260,580 500,340 720,440 C 980,560 1220,360 1440,460 C 1700,580 1940,340 2160,440 C 2420,560 2660,360 2880,460"
            stroke="#D9822B"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          <path
            d="M 0,475 C 260,595 500,355 720,455 C 980,575 1220,375 1440,475 C 1700,595 1940,355 2160,455 C 2420,575 2660,375 2880,475"
            stroke="#FEF08A"
            strokeWidth="0.9"
            strokeDasharray="3 6"
            strokeOpacity="0.38"
          />

          {/* Fine Stippled Ribbon 6 */}
          <path
            d="M 0,620 C 300,500 620,680 720,590 C 1000,480 1260,670 1440,620 C 1740,500 2060,680 2160,590 C 2440,480 2700,670 2880,620"
            stroke="#C8822A"
            strokeWidth="1"
            strokeDasharray="2 6"
            strokeOpacity="0.35"
          />
        </svg>
      </div>

      {/* Layer 3: Subtle golden dune gradient wash at base */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '240px',
          background: 'linear-gradient(to top, rgba(18, 15, 13, 0.9) 0%, rgba(200, 130, 42, 0.08) 60%, transparent 100%)',
        }}
      />
    </div>
  );
}
