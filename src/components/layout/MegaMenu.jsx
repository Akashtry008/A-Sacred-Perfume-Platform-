import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { Flame, Sun, Feather, Wind, Gift, ArrowRight, Sparkles, Layers } from 'lucide-react';

const ICONS = [Flame, Sun, Wind, Feather, Gift, Sparkles, Layers];

const DEFAULT_CATEGORIES = [
  {
    title: 'Bambooless Incense Sticks',
    desc: '100% charcoal-free, non-toxic',
    href: '/collections/bambooless-incense-sticks',
    icon: Flame,
  },
  {
    title: 'Organic Havan Cups',
    desc: 'Desi cow dung & pure A2 ghee',
    href: '/collections/organic-havan-cups',
    icon: Sun,
  },
  {
    title: 'Charcoal-Free Dhoop Cones',
    desc: 'Low smoke, pure resins',
    href: '/collections/charcoal-free-dhoop-cones',
    icon: Wind,
  },
  {
    title: 'Alcohol-Free Attar Sprays',
    desc: 'Pure botanical floral attar',
    href: '/collections/alcohol-free-attar-sprays',
    icon: Feather,
  },
  {
    title: 'Curated Combos & Boxes',
    desc: 'Sampoorna puja gift sets',
    href: '/collections/curated-puja-combos',
    icon: Gift,
  },
];

export default function MegaMenu() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    fetch('/api/collections')
      .then((r) => r.json())
      .then((data) => {
        if (data.collections && data.collections.length > 0) {
          const mapped = data.collections.map((col, idx) => ({
            title: col.title || col.name,
            desc: col.description ? (col.description.slice(0, 36) + '...') : 'Pure Vedic formulation',
            href: `/collections/${col.slug}`,
            icon: ICONS[idx % ICONS.length],
          }));
          setCategories(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div
      className="mega-menu"
      role="menu"
      style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '960px',
        maxWidth: 'calc(100vw - 48px)',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EAE3D6',
        borderRadius: '16px',
        boxShadow: '0 20px 48px rgba(35, 25, 15, 0.12)',
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: '280px 1fr 280px',
        gap: '24px',
        alignItems: 'stretch',
        zIndex: 100,
      }}
    >
      {/* Column 1: Feature Banner */}
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          height: '100%',
          minHeight: '320px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80"
          alt="Sacred Vedic Puja Ritual"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(28, 25, 23, 0.92) 0%, rgba(28, 25, 23, 0.3) 60%, transparent 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, padding: '20px', color: '#FAF7F2' }}>
          <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#E09C48', fontWeight: 600, marginBottom: '4px' }}>
            Gandhashastra Heritage
          </p>
          <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', margin: '0 0 10px', color: '#FAF7F2', lineHeight: 1.3 }}>
            The Purity of Vedic Samagri
          </h4>
          <Link
            href="/collections"
            style={{
              fontSize: '0.8125rem',
              color: '#FAF7F2',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
            }}
          >
            Explore Range <ArrowRight size={14} color="#E09C48" />
          </Link>
        </div>
      </div>

      {/* Column 2: Categories */}
      <div>
        <p
          style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#78716C',
            fontWeight: 700,
            marginBottom: '14px',
          }}
        >
          Browse By Category
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#1C1917',
                  transition: 'background-color 0.2s',
                }}
                className="mega-cat-item"
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(200, 130, 42, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C8822A',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0, color: '#1C1917' }}>
                    {cat.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#6B635B', margin: 0 }}>
                    {cat.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Column 3: Packs & Merchandising (Balanced Symmetric Spacing) */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p
          style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#78716C',
            fontWeight: 700,
            marginBottom: '14px',
          }}
        >
          Select Pack Size
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'space-between' }}>
          <Link
            href="/products/mysore-sandalwood-bambooless-incense"
            style={{
              display: 'block',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#FAF7F2',
              border: '1px solid #EAE3D6',
              textDecoration: 'none',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            className="pack-card-hover"
          >
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#C8822A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Beginners
            </span>
            <h5 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '2px 0 2px', color: '#1C1917' }}>
              Discovery Trial Packs
            </h5>
            <p style={{ fontSize: '0.72rem', color: '#6B635B', margin: 0, lineHeight: 1.4 }}>
              Sample 5 signature divine fragrances before committing.
            </p>
          </Link>

          <Link
            href="/collections/daily-puja-essentials"
            style={{
              display: 'block',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#FAF7F2',
              border: '1px solid #EAE3D6',
              textDecoration: 'none',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            className="pack-card-hover"
          >
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#C8822A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Everyday Puja
            </span>
            <h5 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '2px 0 2px', color: '#1C1917' }}>
              Pack of 40 Sticks
            </h5>
            <p style={{ fontSize: '0.72rem', color: '#6B635B', margin: 0, lineHeight: 1.4 }}>
              Hand-rolled with tree resins for morning & evening aarti.
            </p>
          </Link>

          <Link
            href="/collections/refill-saver-packs"
            style={{
              display: 'block',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#FAF7F2',
              border: '1px solid #EAE3D6',
              textDecoration: 'none',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            className="pack-card-hover"
          >
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#C8822A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Economy Refill
            </span>
            <h5 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '2px 0 2px', color: '#1C1917' }}>
              Pack of 100 Sticks
            </h5>
            <p style={{ fontSize: '0.72rem', color: '#6B635B', margin: 0, lineHeight: 1.4 }}>
              Value saver packaging designed to minimize box waste.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
