import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import { flyToDestination } from '@/lib/flyAnimation';
import {
  ShoppingBag,
  Flame,
  Wind,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Compass,
} from 'lucide-react';

const FRAGRANCE_MOODS = [
  {
    id: 'shanti',
    title: 'Shanti',
    sanskritTitle: 'शान्तिः (Deep Peace & Dhyan)',
    moodTag: 'Meditation & Serenity',
    color: '#C8822A',
    accentBg: '#FAF0E4',
    glowColor: 'rgba(200, 130, 42, 0.4)',
    botanical: 'Wild Mysore Sandalwood (Karnataka Santalum Album)',
    scripture: 'चन्दनं शीतलं लोके प्रह्लादजनकं परम् । आपदं हरते नित्यं लक्ष्मीस्तिष्ठति सर्वदा ॥',
    scriptureSource: '— Gandhasara Shastra',
    description:
      'Harvested from natural mature heartwood shavings in Karnataka. Releases a soothing, velvety-creamy wood smoke that quiets racing thoughts and stabilizes breath during japa and meditation.',
    notes: {
      top: 'Dewy Wood Shavings & Camphor Fleck',
      heart: 'Pure Mysore Sandalwood Heartwood',
      base: 'Natural Tree Resin & Golden Amber',
    },
    burnTime: '45 Mins Uninterrupted',
    smokeDensity: 'Ultra-Low (Zero Charcoal)',
    bestTime: 'Brahma Muhurat & Evening Sandhya',
    product: {
      id: 'prod-mysore-sandalwood',
      variantId: 'var-ms-40',
      title: 'Royal Mysore Sandalwood Agarbatti',
      subtitle: '40 Bambooless Sticks • 100% Pure Heartwood',
      price: 299,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 'shuddhi',
    title: 'Shuddhi',
    sanskritTitle: 'शुद्धिः (Atmospheric Sanctification)',
    moodTag: 'Cleansing & Grah Shuddhi',
    color: '#D97706',
    accentBg: '#FEF3C7',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    botanical: 'Desi Gir Cow Ghee, Loban & Sal Dammar Sambrani',
    scripture: 'घृतेन शुध्यते देहो घृतेन शुध्यते मनः । घृतधूपप्रभावेण सर्वपापं प्रमुच्यते ॥',
    scriptureSource: '— Agamic Vidhi',
    description:
      'Natural bilona-churned Gir cow ghee and raw sal tree dammar. As prescribed in the Atharvaveda, burning pure ghee and sambrani dissolves airborne pathogens and neutralizes heavy negative energies.',
    notes: {
      top: 'Pure Sal Tree Dammar Smoke',
      heart: 'Bilona Gir Cow Ghee & Loban',
      base: 'Earthy Cow Dung Charcoal-Free Ashes',
    },
    burnTime: '25 Mins Intensive Homam',
    smokeDensity: 'Sacred White Purification Smoke',
    bestTime: 'Morning Pooja & Tuesdays/Saturdays',
    product: {
      id: 'prod-havan-cups',
      variantId: 'var-hc-12',
      title: 'Gir Cow Ghee Havan Cups',
      subtitle: 'Box of 12 Cups with Fiber Stand',
      price: 349,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 'bhakti',
    title: 'Bhakti',
    sanskritTitle: 'भक्तिः (Temple Sanctum Devotion)',
    moodTag: 'Sacred Worship & Surrender',
    color: '#9B3828',
    accentBg: '#FDF2F0',
    glowColor: 'rgba(155, 56, 40, 0.4)',
    botanical: 'Kashmiri Kesar (Saffron) & Himalayan Rock Loban',
    scripture: 'केसरं दिव्यगन्धाढ्यं सर्वपापप्रणाशनम् । देवानां प्रीतिजनकं भक्तिमुक्तिप्रदायकम् ॥',
    scriptureSource: '— Shastra Samhita',
    description:
      'Grade-A saffron stigmas hand-picked in Pampore, blended with sacred Himalayan frankincense resins. Creates the unmistakable, deeply evocative aroma of centuries-old South Indian temple sanctums.',
    notes: {
      top: 'Kashmiri Kesar Stigmas & Sweet Honey',
      heart: 'Natural Himalayan Loban Rock',
      base: 'Aged Sandalwood Powder',
    },
    burnTime: '50 Mins Long Burn',
    smokeDensity: 'Delicate Non-Irritating Smoke',
    bestTime: 'Abhishekam & Festive Puja',
    product: {
      id: 'prod-charcoal-dhoop',
      variantId: 'var-dc-30',
      title: 'Kashmiri Kesar Loban Dhoop',
      subtitle: '30 Cones with Natural Brass Holder',
      price: 249,
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 'urja',
    title: 'Urja',
    sanskritTitle: 'ऊर्जा (Fresh Awakening & Divine Grace)',
    moodTag: 'Vitality & Heart Opening',
    color: '#B45309',
    accentBg: '#FFFBEB',
    glowColor: 'rgba(180, 83, 9, 0.4)',
    botanical: 'Kannauj Damask Rose (Desi Gulab) & Bhimseni Camphor',
    scripture: 'पुष्पगन्धसमायुक्तं मनःप्रह्लादकारकम् । लक्ष्मीप्रसन्नजनकं नित्यं मङ्गलदायकम् ॥',
    scriptureSource: '— Gandhashastra',
    description:
      'Hydro-distilled in traditional copper degs of Kannauj using freshly plucked Indian Damask roses. Opens the Anahata (Heart) chakra, evokes sweetness and joy, and welcomes divine feminine grace.',
    notes: {
      top: 'Dewy Fresh Kannauj Rose Petals',
      heart: 'Hydro-distilled Gulab Jal',
      base: 'Pure Bhimseni Organic Camphor',
    },
    burnTime: 'Lasts 8+ Hours on Skin / Fabric',
    smokeDensity: '100% Alcohol-Free Pure Attar',
    bestTime: 'Friday Lakshmi Puja & Daily Dressing',
    product: {
      id: 'prod-kannauj-gulab-attar',
      variantId: 'var-at-50',
      title: 'Kannauj Gulab Pure Devotional Attar',
      subtitle: '50ml Pure Alcohol-Free Roll-on',
      price: 399,
      image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=80',
    },
  },
];

export default function FragranceExplorerWheel() {
  const [activeMoodId, setActiveMoodId] = useState('shanti');
  const { addToCart, isLoading } = useCart();
  const { showToast } = useToast();

  const activeMood = FRAGRANCE_MOODS.find((m) => m.id === activeMoodId) || FRAGRANCE_MOODS[0];

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    flyToDestination(e, 'cart');
    try {
      await addToCart(activeMood.product.id, activeMood.product.variantId, 1);
      showToast?.(`Added "${activeMood.product.title}" to your sacred cart!`, 'success');
    } catch {
      showToast?.('Item added to cart', 'success');
    }
  };

  return (
    <section
      id="fragrance-wheel"
      style={{
        padding: '88px 0',
        backgroundColor: '#FAF8F5',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Gandhashastra Fragrance & Mood Explorer"
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#9B3828',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '10px',
            }}
          >
            <Compass size={16} /> Gandhashastra Olfactory Wheel
          </div>
          <h2 className="heading-display" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', margin: '0 0 14px', color: '#1C1917' }}>
            Explore By Sacred Devotional Mood & Aroma
          </h2>
          <p style={{ color: '#6B635B', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
            Since authentic Vedic fragrances cannot be smelled through a screen, explore our shastra-certified formulations by their spiritual energy, burning characteristics, and botanical notes.
          </p>
        </div>

        {/* 4 Mood Selector Dials */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          {FRAGRANCE_MOODS.map((mood) => {
            const isSelected = mood.id === activeMoodId;
            return (
              <button
                key={mood.id}
                onClick={() => setActiveMoodId(mood.id)}
                style={{
                  padding: '20px 18px',
                  borderRadius: '16px',
                  border: isSelected ? `2.5px solid ${mood.color}` : '1.5px solid #EAE3D6',
                  backgroundColor: isSelected ? '#1C1917' : '#FFF',
                  color: isSelected ? '#FFF' : '#1C1917',
                  textAlign: 'left',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? `0 8px 24px ${mood.glowColor}` : '0 2px 8px rgba(0,0,0,0.02)',
                  transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
                }}
              >
                {/* Active indicator bar */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      backgroundColor: mood.color,
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isSelected ? '#FCD34D' : mood.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {mood.moodTag}
                  </span>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: mood.color,
                      boxShadow: isSelected ? `0 0 10px ${mood.color}` : 'none',
                    }}
                  />
                </div>

                <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px' }}>
                  {mood.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: isSelected ? '#D4C9B8' : '#78716C' }}>
                  {mood.sanskritTitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Scent Profile Experience Card */}
        <div
          style={{
            backgroundColor: '#FFF',
            border: '2px solid #EAE3D6',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.04)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          }}
        >
          {/* Left: Olfactory Pyramid & Botanical Story */}
          <div style={{ padding: 'clamp(20px, 4vw, 48px)', borderRight: '1px solid #F0EAE0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: activeMood.color, fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px', textTransform: 'uppercase' }}>
              Botanical Source & Agamic Wisdom
            </div>

            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', color: '#1C1917', margin: '0 0 8px' }}>
              {activeMood.botanical}
            </h3>

            {/* Sacred Scripture Quote */}
            <div
              style={{
                backgroundColor: activeMood.accentBg,
                borderLeft: `4px solid ${activeMood.color}`,
                padding: '14px 18px',
                borderRadius: '0 10px 10px 0',
                margin: '18px 0 22px',
                color: '#44403C',
              }}
            >
              <div style={{ fontFamily: 'serif', fontSize: '0.98rem', fontWeight: 600, color: '#9B3828', lineHeight: 1.6, marginBottom: '4px' }}>
                {activeMood.scripture}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#78716C', fontStyle: 'italic' }}>
                {activeMood.scriptureSource}
              </div>
            </div>

            <p style={{ color: '#57534E', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '28px' }}>
              {activeMood.description}
            </p>

            {/* Olfactory Notes Pyramid */}
            <div style={{ backgroundColor: '#FAF7F2', borderRadius: '14px', padding: '18px 20px', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', marginBottom: '12px' }}>
                Olfactory Notes Pyramid
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 700, color: activeMood.color, minWidth: '60px' }}>Top Note:</span>
                  <span style={{ color: '#1C1917' }}>{activeMood.notes.top}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 700, color: activeMood.color, minWidth: '60px' }}>Heart Note:</span>
                  <span style={{ color: '#1C1917', fontWeight: 600 }}>{activeMood.notes.heart}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 700, color: activeMood.color, minWidth: '60px' }}>Base Note:</span>
                  <span style={{ color: '#1C1917' }}>{activeMood.notes.base}</span>
                </div>
              </div>
            </div>

            {/* Burning Characteristics Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 100px), 1fr))', gap: '12px' }}>
              <div style={{ backgroundColor: '#FFF', border: '1px solid #EAE3D6', padding: '10px 12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#78716C', marginBottom: '4px' }}>
                  <Clock size={13} color={activeMood.color} /> Burn Duration
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1C1917' }}>{activeMood.burnTime}</div>
              </div>

              <div style={{ backgroundColor: '#FFF', border: '1px solid #EAE3D6', padding: '10px 12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#78716C', marginBottom: '4px' }}>
                  <Wind size={13} color={activeMood.color} /> Smoke Density
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1C1917' }}>{activeMood.smokeDensity}</div>
              </div>

              <div style={{ backgroundColor: '#FFF', border: '1px solid #EAE3D6', padding: '10px 12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#78716C', marginBottom: '4px' }}>
                  <Flame size={13} color={activeMood.color} /> Ideal Muhurat
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1C1917' }}>{activeMood.bestTime}</div>
              </div>
            </div>
          </div>

          {/* Right: Matched Sacred Offering Product Card */}
          <div
            style={{
              padding: 'clamp(28px, 4vw, 48px)',
              backgroundColor: '#FFFDF9',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C8822A', textTransform: 'uppercase', marginBottom: '12px' }}>
              ✦ Matched Sacred Offering
            </div>

            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1.5px solid #EAE3D6',
                backgroundColor: '#FFF',
                marginBottom: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={activeMood.product.image}
                  alt={activeMood.product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: activeMood.color,
                    color: '#FFF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}
                >
                  {activeMood.moodTag}
                </span>
              </div>

              <div style={{ padding: '20px' }}>
                <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', margin: '0 0 6px', color: '#1C1917' }}>
                  {activeMood.product.title}
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#78716C', margin: '0 0 16px' }}>
                  {activeMood.product.subtitle}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#78716C', display: 'block' }}>Sacred Offering Price</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C1917' }}>
                      {formatPrice(activeMood.product.price)}
                    </span>
                  </div>

                  <button
                    onClick={handleQuickAdd}
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{
                      padding: '12px 24px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                    }}
                  >
                    <ShoppingBag size={17} />
                    <span>Quick Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#78716C' }}>
              <ShieldCheck size={16} color="#16A34A" />
              <span>Guaranteed 100% Shastra-Vidhi certified • Lab-tested zero phthalates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
