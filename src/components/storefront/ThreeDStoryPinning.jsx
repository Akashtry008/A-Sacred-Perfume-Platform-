import React, { useState, useEffect, useRef } from 'react';
import Link from '@/components/common/Link';
import { ShieldCheck, Heart, Award, ArrowRight, ShoppingBag, Flame, Play, Pause, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { flyToDestination } from '@/lib/flyAnimation';

const STORY_STAGES = [
  {
    step: '01',
    title: 'Gandhashastra Herb Selection',
    subtitle: 'Wild Mysore Sandalwood & Kashmiri Kesar',
    desc: 'Our artisans harvest pure heartwood shavings of Karnataka Santalum Album, blended with Himalayan Jatamansi and sacred tree bark gums. Absolutely zero synthetic phthalates, petroleum binders, or dipped fragrance oils.',
    color: '#C8822A',
    frontImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80',
    frontLabel: 'Royal Mysore Sandalwood',
    backLabel: 'Pure Sacred Burning Embers',
    glow: 'rgba(200, 130, 42, 0.45)',
    scriptureQuote: '"चन्दनं शीतलं लोके प्रह्लादजनकं परम्..." — Gandhasara',
  },
  {
    step: '02',
    title: 'Desi Cow Ghee & Tree Resins Blend',
    subtitle: 'A2 Gir Cow Ghee, Pure Sambrani & Guggal',
    desc: 'Each sacred formulation is enriched with bilona-churned Desi cow ghee and organic sal tree dammar. As prescribed in the Agamas, natural cow ghee creates atmospheric shuddhi and dissolves negative energy.',
    color: '#E09C48',
    frontImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    frontLabel: 'Organic Desi Cow Ghee',
    backLabel: 'Pure Loban & Sambrani Smoke',
    glow: 'rgba(224, 156, 72, 0.55)',
    scriptureQuote: '"घृतेन दीपो हव्यं च सर्वपापप्रणाशनम्..." — Rigveda Samhita',
  },
  {
    step: '03',
    title: 'Zero-Bamboo Sacred Rolled Geometry',
    subtitle: 'Strict Vamsha Prohibition & Charcoal-Free Purity',
    desc: 'Vedic Shastras prohibit the burning of bamboo as it represents lineage (Vamsha) and releases heavy metal emissions. VedaPavitra agarbatti is 100% bambooless, charcoal-free, delivering sweet divine white smoke.',
    color: '#1E5E3A',
    frontImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    frontLabel: '100% Bambooless Core',
    backLabel: 'Hand-Rolled Herbal Geometry',
    glow: 'rgba(30, 94, 58, 0.5)',
    scriptureQuote: '"वंशदाहो न कर्तव्यः कुलनाशकरो यतः..." — Padma Purana',
  },
  {
    step: '04',
    title: 'Divine Sanctification & Atmosphere Purification',
    subtitle: 'Sanctifying Every Corner of Your Sacred Home',
    desc: 'When lit during morning sandhya or evening aarti, the slow-smoldering embers release sacred botanicals that calm the nervous system, deepen dhyana, and fill your puja ghar with pure temple sanctity in 15 minutes.',
    color: '#9B3828',
    frontImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80',
    frontLabel: 'Temple Sanctity Formulation',
    backLabel: 'Sacred Sanctified Altar Aura',
    glow: 'rgba(155, 56, 40, 0.5)',
    scriptureQuote: '"यज्ञेन यज्ञमयजन्त देवास्तानि धर्माणि..." — Purusha Suktam',
  },
];

// Dynamic 3D Spatial Trajectories: Image object glides, tilts, scales & elevates between steps
const STEP_MOTIONS = [
  // Step 01: Centered foundational stance
  { x: 0, y: 0, z: 0, rotZ: 0, scale: 1.0 },
  // Step 02: Glides forward-right with an inquisitive angle
  { x: 26, y: -14, z: 32, rotZ: -4, scale: 1.05 },
  // Step 03: Glides left and ascends
  { x: -24, y: 12, z: 22, rotZ: 4, scale: 1.03 },
  // Step 04: Divine zenith lift - elevated high in spiritual sanctification
  { x: 0, y: -26, z: 48, rotZ: 0, scale: 1.08 },
];

export default function ThreeDStoryPinning() {
  const [activeStage, setActiveStage] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(25);
  const [tiltAngleX, setTiltAngleX] = useState(8);
  const [isAutoOrbit, setIsAutoOrbit] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 900);
  const containerRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const { addToCart } = useCart();
  const { showToast } = useToast();

  const stage = STORY_STAGES[activeStage];
  const motion = STEP_MOTIONS[activeStage] || STEP_MOTIONS[0];

  // Screen size check for mobile layout adaptation
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Screen Pinning: Monitor scroll position and advance across the 4 steps across all screen sizes
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScrolled / totalScrollable));
      setScrollProgress(progress);

      // Determine step based on progress (0.00 - 1.00 divided into 4 segments)
      const stepIdx = Math.min(3, Math.floor(progress * 4));
      setActiveStage(stepIdx);

      // Rotate canvas in sync with scroll progress if not manually dragging
      if (!isDragging) {
        setRotationAngle((25 + progress * 360) % 360);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDragging]);

  // Gentle auto-orbit when idle
  useEffect(() => {
    if (!isAutoOrbit || isDragging) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.35) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoOrbit, isDragging]);

  // Mouse / Touch drag to spin in 360°
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsAutoOrbit(false);
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    dragStart.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const deltaX = (clientX - dragStart.current.x) * 0.6;
    const deltaY = (clientY - dragStart.current.y) * -0.4;
    setRotationAngle((prev) => (prev + deltaX) % 360);
    setTiltAngleX((prev) => Math.max(-30, Math.min(30, prev + deltaY)));
    dragStart.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => setIsDragging(false);

  // Jump to specific stage by smoothly scrolling pinned track
  const jumpToStage = (idx) => {
    const targetIdx = Math.max(0, Math.min(STORY_STAGES.length - 1, idx));
    setActiveStage(targetIdx);

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;
    if (totalScrollable > 0) {
      const targetProgress = (targetIdx + 0.5) / STORY_STAGES.length;
      const targetScroll = containerTop + targetProgress * totalScrollable;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const handlePrevStage = () => {
    if (activeStage > 0) jumpToStage(activeStage - 1);
  };

  const handleNextStage = () => {
    if (activeStage < STORY_STAGES.length - 1) jumpToStage(activeStage + 1);
  };

  const handleAddToCart = (e) => {
    if (e) flyToDestination(e, 'cart');
    addToCart({
      id: 'prod-mysore-sandalwood',
      title: 'Royal Mysore Sandalwood Bambooless Incense',
      price: 299,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      quantity: 1,
    });
    showToast('Royal Mysore Sandalwood added to your Sacred Cart!', 'success');
  };

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        height: isMobile ? '240vh' : '300vh', // Continuous screen-pinning track on ALL devices
        backgroundColor: '#FAF7F2',
      }}
      aria-label="Sacred Devotional Journey"
    >
      {/* Viewport Container: Screen-Pinned with sticky positioning on ALL screen sizes */}
      <div
        style={{
          position: 'sticky',
          top: isMobile ? '56px' : '72px',
          minHeight: isMobile ? 'calc(100vh - 56px)' : 'calc(100vh - 72px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isMobile ? '12px 6px' : '16px 0',
          backgroundColor: '#FAF7F2',
          zIndex: 10,
        }}
      >
        <div className="container" style={{ maxWidth: '1200px', width: '100%' }}>
          {/* Top Stage Indicator & Scrub Progress Bar (Compact & Clean) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              padding: '0 4px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: stage.color,
                }}
              >
                Sacred Vidhi • Step {stage.step} of 04
              </span>
              <span style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 500 }}>
                — {stage.subtitle}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Prev / Next Quick Controls */}
              <button
                type="button"
                onClick={handlePrevStage}
                disabled={activeStage === 0}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #EAE3D6',
                  backgroundColor: '#FFFFFF',
                  cursor: activeStage === 0 ? 'not-allowed' : 'pointer',
                  opacity: activeStage === 0 ? 0.35 : 1,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#44403C',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Previous Stage"
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>
              <button
                type="button"
                onClick={handleNextStage}
                disabled={activeStage === STORY_STAGES.length - 1}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #EAE3D6',
                  backgroundColor: '#FFFFFF',
                  cursor: activeStage === STORY_STAGES.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: activeStage === STORY_STAGES.length - 1 ? 0.35 : 1,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#44403C',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Next Stage"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>

              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#78716C', marginLeft: '4px' }}>
                Progress:
              </span>
              <div
                style={{
                  width: isMobile ? '80px' : '120px',
                  height: '6px',
                  backgroundColor: '#EAE3D6',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.round(scrollProgress * 100)}%`,
                    backgroundColor: stage.color,
                    transition: 'width 0.15s ease-out',
                    boxShadow: `0 0 6px ${stage.glow}`,
                  }}
                />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: stage.color, minWidth: '32px' }}>
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>
          </div>

          {/* 4-Step Interactive Card - Perfectly fits inside screen without vertical clipping */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(20px, 3vw, 36px)',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #EAE3D6',
              borderRadius: '24px',
              padding: 'clamp(16px, 2.5vw, 36px)',
              boxShadow: '0 20px 50px rgba(35, 25, 15, 0.08)',
              position: 'relative',
            }}
          >
            {/* Column 1: Dual-Sided 360° Rotating Product Canvas */}
            <div
              style={{
                position: 'relative',
                height: isMobile ? '190px' : '380px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                perspective: '1200px',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none',
                maxWidth: '100%',
                overflow: 'hidden',
              }}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            >
              {/* Dynamic 3D Sacred Image Object - Moves, Glides and Rotates Within Vidhi Steps */}
              <div
                style={{
                  position: 'relative',
                  width: isMobile ? '135px' : '205px',
                  height: isMobile ? '195px' : '290px',
                  transformStyle: 'preserve-3d',
                  transform: `translate3d(${isMobile ? motion.x * 0.45 : motion.x}px, ${isMobile ? motion.y * 0.45 : motion.y}px, ${motion.z}px) rotateX(${tiltAngleX}deg) rotateY(${rotationAngle}deg) rotateZ(${motion.rotZ}deg) scale(${motion.scale})`,
                  transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.2, 0.8, 0.25, 1)',
                  willChange: 'transform',
                }}
              >
                {/* FRONT FACE OF PRODUCT */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg) translateZ(8px)',
                    boxShadow: '0 20px 45px rgba(28, 25, 23, 0.22)',
                    border: '2px solid rgba(200, 130, 42, 0.75)',
                    backgroundColor: '#1C1917',
                  }}
                >
                  <img
                    src={stage.frontImage}
                    alt={stage.frontLabel}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(28, 25, 23, 0.88) 0%, transparent 60%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '10px',
                      right: '10px',
                      color: '#FAF7F2',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FEF08A', margin: 0, fontWeight: 700 }}>
                      Front • Pure Packaging
                    </p>
                    <h5 style={{ fontFamily: 'Georgia, serif', fontSize: '0.92rem', margin: '2px 0 0' }}>
                      {stage.frontLabel}
                    </h5>
                  </div>
                </div>

                {/* BACK FACE OF PRODUCT */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg) translateZ(8px)',
                    boxShadow: '0 20px 45px rgba(28, 25, 23, 0.22)',
                    border: '2px solid rgba(200, 130, 42, 0.75)',
                    backgroundColor: '#1C1917',
                  }}
                >
                  <img
                    src={stage.backImage}
                    alt={stage.backLabel}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(28, 25, 23, 0.88) 0%, transparent 60%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '10px',
                      right: '10px',
                      color: '#FAF7F2',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FEF08A', margin: 0, fontWeight: 700 }}>
                      Back • Ritual Use
                    </p>
                    <h5 style={{ fontFamily: 'Georgia, serif', fontSize: '0.92rem', margin: '2px 0 0' }}>
                      {stage.backLabel}
                    </h5>
                  </div>
                </div>
              </div>

            </div>

            {/* Column 2: Story Stages Tabs & Active Narrative */}
            <div>
              {/* Step Navigation Tabs with Screen-Pinning sync */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: isMobile ? '12px' : '18px' }}>
                {STORY_STAGES.map((stg, idx) => (
                  <button
                    key={stg.step}
                    onClick={() => jumpToStage(idx)}
                    className="btn"
                    style={{
                      flex: 1,
                      padding: isMobile ? '7px 2px' : '10px 4px',
                      borderRadius: '8px',
                      border: activeStage === idx ? `2px solid ${stg.color}` : '1px solid #EAE3D6',
                      backgroundColor: activeStage === idx ? 'rgba(200, 130, 42, 0.12)' : '#FAF7F2',
                      cursor: 'pointer',
                      textAlign: 'center',
                      boxShadow: activeStage === idx ? '0 4px 12px rgba(200, 130, 42, 0.15)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontSize: isMobile ? '0.7rem' : '0.74rem',
                        fontWeight: 700,
                        color: activeStage === idx ? stg.color : '#78716C',
                        display: 'block',
                        textTransform: 'uppercase',
                      }}
                    >
                      Step {stg.step}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Stage Narrative Card */}
              <div
                key={activeStage}
                style={{
                  animation: 'fadeIn 0.35s ease-in-out',
                  marginBottom: isMobile ? '12px' : '20px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: stage.color,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    marginBottom: '4px',
                  }}
                >
                  {stage.subtitle}
                </span>
                <h3
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: isMobile ? '1.25rem' : 'clamp(1.4rem, 2.2vw, 1.8rem)',
                    color: '#1C1917',
                    marginBottom: isMobile ? '6px' : '8px',
                    lineHeight: 1.25,
                  }}
                >
                  {stage.title}
                </h3>

                {/* Sanskrit Scripture Shloka Tag */}
                <div
                  style={{
                    backgroundColor: 'rgba(200, 130, 42, 0.08)',
                    borderLeft: `3px solid ${stage.color}`,
                    padding: isMobile ? '6px 10px' : '8px 12px',
                    borderRadius: '0 8px 8px 0',
                    marginBottom: isMobile ? '10px' : '12px',
                    fontStyle: 'italic',
                    fontSize: isMobile ? '0.78rem' : '0.82rem',
                    color: '#7C2D12',
                  }}
                >
                  {stage.scriptureQuote}
                </div>

                <p
                  style={{
                    color: '#57534E',
                    fontSize: isMobile ? '0.84rem' : '0.9rem',
                    lineHeight: 1.55,
                    marginBottom: isMobile ? '12px' : '18px',
                  }}
                >
                  {stage.desc}
                </p>

                {/* Sacred Highlights Bullets */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isMobile ? '6px' : '10px', marginBottom: isMobile ? '14px' : '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '0.78rem' : '0.83rem', color: '#1C1917' }}>
                    <ShieldCheck size={14} color="#C8822A" />
                    <span>100% Bamboo-Free</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '0.78rem' : '0.83rem', color: '#1C1917' }}>
                    <Heart size={14} color="#C8822A" />
                    <span>Pure Desi Cow Ghee</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '0.78rem' : '0.83rem', color: '#1C1917' }}>
                    <Flame size={14} color="#C8822A" />
                    <span>Low Smoke, Resins</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '0.78rem' : '0.83rem', color: '#1C1917' }}>
                    <Award size={14} color="#C8822A" />
                    <span>Vedic Shastras</span>
                  </div>
                </div>

                {/* Action Buttons (High-contrast hover feedback) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '8px' : '12px' }}>
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary"
                    style={{
                      padding: isMobile ? '9px 16px' : '11px 22px',
                      fontSize: isMobile ? '0.84rem' : '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <ShoppingBag size={16} />
                    <span>Add to Sacred Cart — ₹299</span>
                  </button>
                  <Link
                    href="/products/mysore-sandalwood-bambooless-incense"
                    className="btn-secondary"
                    style={{
                      padding: isMobile ? '9px 14px' : '11px 18px',
                      fontSize: isMobile ? '0.84rem' : '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Ingredients</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Bottom hint indicating screen pinning scroll status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#8C827A' }}>
                <ChevronDown size={14} color={stage.color} style={{ animation: 'bounce 1.5s infinite' }} />
                <span>
                  {activeStage < 3
                    ? `Scroll down to advance to Step 0${activeStage + 2} (${STORY_STAGES[activeStage + 1].title})`
                    : 'All 4 sacred stages completed. Continue scrolling down the sacred journey.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
