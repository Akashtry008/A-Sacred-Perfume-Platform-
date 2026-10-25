import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Wind, Flame, Eye, EyeOff } from 'lucide-react';

/**
 * IncenseBackgroundAmbiance
 * 
 * Features:
 * 1. Full-size authentic AgarBatti (incense stick) standing in the full background:
 *    - Antique brass burner base
 *    - Slender bamboo reed core
 *    - Handcrafted dark masala / sandalwood incense paste body
 *    - Blown glowing ember tip with living ember pulse, smoldering heat aura & micro-sparks
 * 2. Fragrant ethereal incense smoke spreading throughout the platform:
 *    - Dual-engine: Interactive HTML5 canvas particle & silky ribbon physics + layered ambient SVG smoke tendrils
 *    - Smoke curls up from the blown ember tip, billows outward, and drifts across the entire platform width
 *    - Pointer-events: none (zero obstruction to buttons, cards, or user interaction)
 * 3. Discreet luxury ambiance control widget for density & motion preference
 */
export default function IncenseBackgroundAmbiance() {
  const canvasRef = useRef(null);
  const emberRef = useRef(null);
  const animFrameId = useRef(null);
  const particlesRef = useRef([]);
  const sparksRef = useRef([]);

  // Ambiance settings: 'serene' (default classic), 'delicate' (subtle), 'temple' (rich)
  const [intensity, setIntensity] = useState('serene');
  const [isActive, setIsActive] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Emitter coordinates (derived from blown ember element)
  const emitterPos = useRef({ x: 0, y: 0 });

  // Update emitter position based on ember tip element
  const updateEmitterPos = useCallback(() => {
    if (emberRef.current) {
      const rect = emberRef.current.getBoundingClientRect();
      emitterPos.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + 2,
      };
    } else {
      // Fallback: estimate from right edge & viewport height
      emitterPos.current = {
        x: window.innerWidth - 48,
        y: window.innerHeight * 0.22,
      };
    }
  }, []);

  useEffect(() => {
    updateEmitterPos();
    window.addEventListener('resize', updateEmitterPos);
    return () => window.removeEventListener('resize', updateEmitterPos);
  }, [updateEmitterPos]);

  // Main Canvas Smoke & Spark Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      updateEmitterPos();
    };
    window.addEventListener('resize', handleResize);

    // Density factor
    const densityMap = {
      delicate: { spawnRate: 0.7, maxParticles: 60, alphaMult: 0.7, spreadMult: 0.8 },
      serene: { spawnRate: 1.2, maxParticles: 110, alphaMult: 1.0, spreadMult: 1.0 },
      temple: { spawnRate: 1.8, maxParticles: 160, alphaMult: 1.35, spreadMult: 1.2 },
    };
    const currentDensity = densityMap[intensity] || densityMap.serene;

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      const { x: emX, y: emY } = emitterPos.current;

      // 1. SPAWN SMOKE PARTICLES
      if (Math.random() < currentDensity.spawnRate && particlesRef.current.length < currentDensity.maxParticles) {
        particlesRef.current.push({
          x: emX + (Math.random() - 0.5) * 2,
          y: emY - 2,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(1.1 + Math.random() * 0.9), // upward buoyancy
          age: 0,
          maxAge: 320 + Math.random() * 180,
          baseRadius: 3 + Math.random() * 2,
          maxRadius: (150 + Math.random() * 110) * currentDensity.spreadMult,
          driftSpeed: (0.7 + Math.random() * 1.1) * currentDensity.spreadMult, // drift left across platform
          curlFreq: 0.022 + Math.random() * 0.012,
          curlAmp: 1.2 + Math.random() * 1.4,
          curlPhase: Math.random() * Math.PI * 2,
        });
      }

      // 2. SPAWN FLOATING MICRO-SPARKS FROM BLOWN EMBER TIP
      if (Math.random() < 0.22 && sparksRef.current.length < 15) {
        sparksRef.current.push({
          x: emX + (Math.random() - 0.5) * 4,
          y: emY + (Math.random() - 0.5) * 3,
          vx: (Math.random() - 0.7) * 0.9,
          vy: -(0.8 + Math.random() * 1.5),
          age: 0,
          maxAge: 35 + Math.random() * 35,
          size: 1.2 + Math.random() * 1.6,
          color: Math.random() > 0.4 ? '#FFD54F' : '#FF7043',
        });
      }

      // 3. UPDATE & DRAW SMOKE PARTICLES
      const activeParticles = [];
      const ribbonPoints = []; // First recent points form the silky laminar ribbon

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.age++;

        if (p.age >= p.maxAge) continue;

        const progress = p.age / p.maxAge;

        // Stage 1: Initial laminar curl (first 15% of lifetime, right above ember)
        if (progress < 0.15) {
          p.x += Math.sin(p.age * p.curlFreq + p.curlPhase) * p.curlAmp;
          p.y += p.vy;
          if (ribbonPoints.length < 24) {
            ribbonPoints.push({ x: p.x, y: p.y, age: p.age });
          }
        } else {
          // Stage 2: Billowing dispersion & spreading across the platform (drifting leftward & upward)
          const spreadFactor = Math.sin(progress * Math.PI);
          p.x -= p.driftSpeed * (0.8 + spreadFactor * 0.4) + Math.sin(p.age * 0.01) * 0.5;
          p.y += p.vy * (1 - progress * 0.4); // gentle deceleration
        }

        // Particle radius blooms as it spreads across the screen
        const curRadius = p.baseRadius + (p.maxRadius - p.baseRadius) * Math.pow(progress, 0.75);

        // Alpha calculation: gentle fade in, long serene drift, soft dissipation
        const fadeIn = Math.min(1, p.age / 24);
        const fadeOut = Math.max(0, 1 - progress);
        const alpha = fadeIn * fadeOut * 0.13 * currentDensity.alphaMult;

        if (alpha > 0.005) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, curRadius);
          // Pure ivory / sandalwood warm vapor
          grad.addColorStop(0, `rgba(253, 250, 243, ${alpha})`);
          grad.addColorStop(0.4, `rgba(247, 240, 230, ${alpha * 0.65})`);
          grad.addColorStop(0.75, `rgba(242, 232, 218, ${alpha * 0.25})`);
          grad.addColorStop(1, 'rgba(238, 228, 215, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, curRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        activeParticles.push(p);
      }
      particlesRef.current = activeParticles;

      // 4. DRAW CONTINUOUS SILKY SMOKE RIBBON NEAR TIP
      if (ribbonPoints.length > 2) {
        ctx.beginPath();
        ctx.moveTo(emX, emY);
        for (let i = 0; i < ribbonPoints.length - 1; i++) {
          const xc = (ribbonPoints[i].x + ribbonPoints[i + 1].x) / 2;
          const yc = (ribbonPoints[i].y + ribbonPoints[i + 1].y) / 2;
          ctx.quadraticCurveTo(ribbonPoints[i].x, ribbonPoints[i].y, xc, yc);
        }

        const ribbonGrad = ctx.createLinearGradient(
          emX,
          emY,
          ribbonPoints[ribbonPoints.length - 1].x,
          ribbonPoints[ribbonPoints.length - 1].y
        );
        ribbonGrad.addColorStop(0, 'rgba(255, 250, 240, 0.65)');
        ribbonGrad.addColorStop(0.5, 'rgba(250, 242, 230, 0.4)');
        ribbonGrad.addColorStop(1, 'rgba(245, 235, 220, 0.05)');

        ctx.strokeStyle = ribbonGrad;
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // 5. UPDATE & DRAW MICRO-SPARKS
      const activeSparks = [];
      for (let s of sparksRef.current) {
        s.age++;
        if (s.age >= s.maxAge) continue;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.02; // slight gravity on sparks

        const sparkAlpha = (1 - s.age / s.maxAge) * 0.85;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = sparkAlpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (1 - s.age / s.maxAge * 0.4), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        activeSparks.push(s);
      }
      sparksRef.current = activeSparks;

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, intensity, updateEmitterPos]);

  return (
    <>
      {/* =========================================================================
          BACKGROUND AMBIANCE CONTAINER (Pointer-events: none, z-index: 1)
          Placed behind main foreground content and cards
          ========================================================================= */}
      <div
        className="incense-bg-ambiance-root"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Layer 1: Ethereal Ambient Background Wave Ribbons (Curling across full platform) */}
        {isActive && (
          <div
            className="incense-ambient-waves"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: intensity === 'delicate' ? 0.35 : intensity === 'temple' ? 0.8 : 0.55,
              transition: 'opacity 0.6s ease',
            }}
          >
            {/* Broad spreading smoke wave across upper platform */}
            <svg
              viewBox="0 0 1440 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                filter: 'blur(35px)',
                opacity: 0.65,
              }}
            >
              <path
                d="M1440 220C1250 180 1100 280 850 200C600 120 400 240 180 160C80 120 20 180 0 190V0H1440V220Z"
                fill="url(#smoke-grad-broad)"
              />
              <path
                d="M1440 380C1200 320 1020 440 760 340C520 240 320 380 0 310V180C300 220 540 140 780 230C1040 320 1260 210 1440 260V380Z"
                fill="url(#smoke-grad-mid)"
              />
              <defs>
                <linearGradient id="smoke-grad-broad" x1="1440" y1="200" x2="0" y2="150" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#F9F5EC" stopOpacity="0.45" />
                  <stop offset="45%" stopColor="#F4EDE0" stopOpacity="0.25" />
                  <stop offset="85%" stopColor="#ECE3D2" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="smoke-grad-mid" x1="1440" y1="350" x2="0" y2="280" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FDFBF7" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#F5ECE0" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        {/* Layer 2: High-Performance Canvas for Dynamic Particle & Coiling Smoke Spread */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: isActive ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Layer 3: The Full-Size Incense Stick (Agarbatti) Standing In Background */}
        <div
          className="incense-stick-assembly"
          style={{
            position: 'absolute',
            right: 'clamp(20px, 3.8vw, 56px)',
            bottom: 0,
            width: '50px',
            height: '78vh', // Full-size standing presence
            minHeight: '520px',
            maxHeight: '850px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            filter: 'drop-shadow(0 8px 18px rgba(35, 25, 15, 0.12))',
          }}
        >
          {/* A. BLOWN EMBER GLOWING TIP */}
          <div
            ref={emberRef}
            className="incense-blown-ember"
            style={{
              position: 'relative',
              width: '6.5px',
              height: '14px',
              borderRadius: '3px 3px 1px 1px',
              marginBottom: '-2px',
              zIndex: 3,
            }}
          >
            {/* Smoldering Core */}
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '3px 3px 1px 1px',
                background: 'linear-gradient(to bottom, #FFF3E0 0%, #FFA000 25%, #FF3D00 65%, #C2185B 100%)',
                boxShadow: isActive
                  ? '0 -2px 10px #FF6D00, 0 -6px 22px rgba(255, 87, 34, 0.75), 0 0 35px rgba(255, 152, 0, 0.5)'
                  : 'none',
                animation: isActive ? 'blownEmberPulse 2.8s ease-in-out infinite' : 'none',
              }}
            />

            {/* Sacred White/Silver Ash Tip Collar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-0.5px',
                right: '-0.5px',
                height: '4px',
                borderRadius: '2px 2px 0 0',
                background: 'linear-gradient(to top, rgba(160, 155, 145, 0.8), #E8E5DD 90%)',
                opacity: 0.85,
              }}
            />

            {/* Warm Amber Heat Aura / Radiance Halo */}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: '-35px',
                  left: '-37px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 109, 0, 0.22) 0%, rgba(200, 130, 42, 0.1) 45%, transparent 75%)',
                  pointerEvents: 'none',
                  animation: 'emberHaloBreath 3.2s ease-in-out infinite',
                }}
              />
            )}
          </div>

          {/* B. MASALA AROMATIC INCENSE PASTE BODY (Long slender textured shaft) */}
          <div
            className="incense-paste-shaft"
            style={{
              width: '5.5px',
              flex: 1, // Stretches naturally to span full background height
              maxHeight: 'calc(78vh - 110px)',
              background: 'linear-gradient(to right, #1E150F 0%, #38271C 35%, #523B2B 65%, #291D15 100%)',
              boxShadow: 'inset 0 0 2px rgba(0,0,0,0.6)',
              borderRadius: '1px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Authentic Gandhashastra paste micro-texture */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.25,
                backgroundImage:
                  'radial-gradient(#D4A76A 0.8px, transparent 0.8px), radial-gradient(#8C6329 0.8px, transparent 0.8px)',
                backgroundSize: '3px 7px, 4px 9px',
                backgroundPosition: '0 0, 1.5px 3.5px',
              }}
            />
          </div>

          {/* C. SLENDER BAMBOO ROOT STEM (The uncoated stick base) */}
          <div
            className="incense-bamboo-stem"
            style={{
              width: '3.2px',
              height: '80px',
              background: 'linear-gradient(to right, #8A6126 0%, #D4A76A 45%, #F0CE94 65%, #9C7237 100%)',
              borderRadius: '1px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />

          {/* D. ANTIQUE BRASS AGARBATTI HOLDER STAND (Rooted firmly at bottom) */}
          <div
            className="incense-brass-holder"
            style={{
              position: 'relative',
              width: '42px',
              height: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {/* Brass collar socket holding the stick */}
            <div
              style={{
                width: '10px',
                height: '7px',
                background: 'linear-gradient(to right, #7A551A 0%, #ECC880 50%, #875F1C 100%)',
                borderRadius: '2px 2px 0 0',
                border: '0.5px solid rgba(255, 235, 175, 0.4)',
              }}
            />

            {/* Polished Brass Lotus / Circular Base */}
            <div
              style={{
                width: '42px',
                height: '13px',
                borderRadius: '8px 8px 3px 3px',
                background: 'linear-gradient(135deg, #ECC880 0%, #C8963E 45%, #FAD790 65%, #875F1C 100%)',
                boxShadow: '0 4px 12px rgba(28, 25, 23, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 235, 175, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Delicate ornamental groove on brass base */}
              <div
                style={{
                  width: '34px',
                  height: '2px',
                  background: 'rgba(90, 60, 15, 0.35)',
                  borderRadius: '1px',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DISCREET LUXURY AMBIANCE CONTROLLER (Interactive, pointer-events: auto)
          Fixed floating pill in the bottom corner next to stick
          ========================================================================= */}
      <div
        className="incense-ambiance-widget"
        style={{
          position: 'fixed',
          bottom: '22px',
          right: 'clamp(74px, 7vw, 110px)',
          zIndex: 40,
          pointerEvents: 'auto',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {!showControls ? (
          <button
            onClick={() => setShowControls(true)}
            title="Adjust Sacred Incense Ambiance"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '7px 13px',
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(200, 130, 42, 0.35)',
              borderRadius: '9999px',
              boxShadow: '0 4px 16px rgba(28, 25, 23, 0.08), 0 0 0 1px rgba(200, 130, 42, 0.1)',
              color: '#1C1917',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C8822A';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(200, 130, 42, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200, 130, 42, 0.35)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(28, 25, 23, 0.08)';
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isActive ? '#FF6D00' : '#A8A29E',
                boxShadow: isActive ? '0 0 8px #FF6D00' : 'none',
              }}
            />
            <span style={{ color: '#C8822A', letterSpacing: '0.02em' }}>✦</span>
            <span>Sacred Incense</span>
          </button>
        ) : (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(200, 130, 42, 0.4)',
              borderRadius: '14px',
              padding: '12px 14px',
              boxShadow: '0 16px 36px rgba(28, 25, 23, 0.15), 0 0 0 1px rgba(200, 130, 42, 0.15)',
              minWidth: '220px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={14} color="#C8822A" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1C1917' }}>
                  Incense Ambiance
                </span>
              </div>
              <button
                onClick={() => setShowControls(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.75rem',
                  color: '#8C827A',
                  cursor: 'pointer',
                  padding: '2px 4px',
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.73rem', color: '#6B635B', lineHeight: 1.4 }}>
              Handcrafted agarbatti smoke spreading pure temple tranquility across the platform.
            </p>

            {/* Density Controls */}
            <div style={{ display: 'flex', gap: '4px', background: '#F8F5F0', padding: '3px', borderRadius: '8px' }}>
              {[
                { id: 'delicate', label: 'Delicate' },
                { id: 'serene', label: 'Serene' },
                { id: 'temple', label: 'Temple' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setIntensity(opt.id);
                    setIsActive(true);
                  }}
                  style={{
                    flex: 1,
                    padding: '5px 0',
                    fontSize: '0.72rem',
                    fontWeight: intensity === opt.id && isActive ? 700 : 500,
                    color: intensity === opt.id && isActive ? '#1C1917' : '#6B635B',
                    background: intensity === opt.id && isActive ? '#FFFFFF' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    boxShadow: intensity === opt.id && isActive ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Power Toggle */}
            <button
              onClick={() => setIsActive(!isActive)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                width: '100%',
                padding: '6px 0',
                background: isActive ? 'rgba(200, 130, 42, 0.08)' : '#F0EBE1',
                border: '1px solid rgba(200, 130, 42, 0.25)',
                borderRadius: '8px',
                color: isActive ? '#C8822A' : '#6B635B',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isActive ? <Eye size={12} /> : <EyeOff size={12} />}
              {isActive ? 'Incense Active' : 'Incense Paused'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
