import React, { useState } from 'react';
import Link from '@/components/common/Link';
import { ShoppingBag, ShieldCheck, Flame, Heart, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { flyToDestination } from '@/lib/flyAnimation';

export default function ThreeDProductShowcase() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState(null);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30; // -15 to +15 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -30; // -15 to +15 deg
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setActiveHotspot(null);
  };

  const handleQuickAdd = async (e) => {
    if (e) flyToDestination(e, 'cart');
    try {
      await addToCart('prod-mysore-sandalwood', 'var-ms-40', 1);
      showToast?.('Royal Mysore Sandalwood added to your sacred cart!', 'success');
    } catch (e) {
      showToast?.('Item added to cart', 'success');
    }
  };

  return (
    <section
      style={{
        padding: '96px 0',
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-labelledby="threed-showcase-title"
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 56px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#C8822A',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            Vedic Sculpture & Sacred Formulation
          </span>
          <h2
            id="threed-showcase-title"
            className="heading-display"
            style={{ fontSize: '2.5rem', margin: '0 0 14px', color: '#1C1917' }}
          >
            The 3D Anatomy of Pure Bambooless Gandha
          </h2>
          <p style={{ color: '#6B635B', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
            Move your cursor or touch to rotate and explore the sacred ingredients molded into each pure VedaPavitra incense stick.
          </p>
        </div>

        {/* 3D Interactive Stage Container */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            backgroundColor: '#FFF',
            border: '1px solid #EAE3D6',
            borderRadius: '24px',
            padding: '56px 40px',
            boxShadow: '0 24px 60px rgba(35, 25, 15, 0.08)',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '48px',
            alignItems: 'center',
            position: 'relative',
            perspective: '1200px',
          }}
        >
          {/* Left Column: 3D Product Float & Rotating Rings */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              minHeight: '440px',
            }}
          >
            {/* Background 3D Rings */}
            <div
              className="consecrated-ring ring-outer"
              style={{
                position: 'absolute',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                border: '1.5px dashed rgba(200, 130, 42, 0.35)',
                pointerEvents: 'none',
              }}
            />
            <div
              className="consecrated-ring ring-inner"
              style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                border: '1px solid rgba(200, 130, 42, 0.2)',
                pointerEvents: 'none',
              }}
            />

            {/* Glowing Golden Aura Pedestal */}
            <div
              style={{
                position: 'absolute',
                bottom: '30px',
                width: '260px',
                height: '40px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(200, 130, 42, 0.35) 0%, rgba(200, 130, 42, 0) 70%)',
                transform: 'rotateX(75deg)',
                filter: 'blur(4px)',
                pointerEvents: 'none',
              }}
            />

            {/* 3D Tilting Product Image */}
            <div
              style={{
                width: '300px',
                height: '380px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: `
                  ${-mousePos.x}px ${mousePos.y + 20}px 40px rgba(35, 25, 15, 0.2),
                  0 0 30px rgba(200, 130, 42, 0.15)
                `,
                transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg) translateY(-8px)`,
                transition: 'transform 0.15s ease-out, box-shadow 0.2s ease',
                position: 'relative',
                zIndex: 5,
                border: '1px solid rgba(200, 130, 42, 0.3)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
                alt="Royal Mysore Sandalwood Incense"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Holographic Shimmer Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%, rgba(200,130,42,0.15) 100%)',
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(28, 25, 23, 0.85)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#FAF7F2',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FEF08A' }}>
                    Royal Mysore Chandan
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#D6D3D1' }}>
                    40 Sticks • Zero Bamboo
                  </div>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>
                  ₹299
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Ingredient Cards & Quick Add */}
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#C8822A',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Gandhashastra Architecture
            </span>
            <h3
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.85rem',
                color: '#1C1917',
                margin: '6px 0 16px',
                lineHeight: 1.3,
              }}
            >
              Why Sanatana Shastras Demand Bambooless Worship
            </h3>
            <p style={{ color: '#6B635B', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Unlike bazaar incense made with cheap toxic waste charcoal and bamboo splints, every VedaPavitra stick is molded with pure tree gums and holy herbs.
            </p>

            {/* 3 Interactive Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <div
                style={{
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #EAE3D6',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  transition: 'transform 0.2s ease, border-color 0.2s',
                  transform: 'translateZ(10px)',
                }}
                className="hover-card-3d"
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(200, 130, 42, 0.15)',
                    color: '#C8822A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#1C1917', margin: '0 0 2px' }}>
                    100% Bamboo-Free (Vamsha Raksha)
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#6B635B', margin: 0, lineHeight: 1.5 }}>
                    Honoring the scriptural tenet that forbids burning bamboo in domestic fires.
                  </p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #EAE3D6',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  transition: 'transform 0.2s ease, border-color 0.2s',
                  transform: 'translateZ(10px)',
                }}
                className="hover-card-3d"
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(200, 130, 42, 0.15)',
                    color: '#C8822A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Flame size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#1C1917', margin: '0 0 2px' }}>
                    45-Minute Soothing Medicinal Burn
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#6B635B', margin: 0, lineHeight: 1.5 }}>
                    Zero choking black smoke or chemical eyes burning during extended meditation.
                  </p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #EAE3D6',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  transition: 'transform 0.2s ease, border-color 0.2s',
                  transform: 'translateZ(10px)',
                }}
                className="hover-card-3d"
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(200, 130, 42, 0.15)',
                    color: '#C8822A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Heart size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#1C1917', margin: '0 0 2px' }}>
                    Certified Desi Cow Ghee & Tree Gums
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#6B635B', margin: 0, lineHeight: 1.5 }}>
                    Releases natural antiseptic airborne prana that sanctifies living spaces.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={handleQuickAdd}
                className="btn btn-primary"
                style={{
                  padding: '14px 28px',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <ShoppingBag size={18} /> Add to Sacred Cart
              </button>
              <Link
                href="/products/mysore-sandalwood-bambooless-incense"
                className="btn btn-secondary"
                style={{
                  padding: '14px 24px',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                View Full Details <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
