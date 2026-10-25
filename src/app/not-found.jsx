import React, { useState } from 'react';
import Link from '@/components/common/Link';
import { useNavigate } from 'react-router-dom';
import { Flame, Search, ArrowRight, Home, Compass } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '85vh', padding: '64px 20px 96px', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '780px', textAlign: 'center' }}>
        {/* Sacred Flame Emblem */}
        <div
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            backgroundColor: '#FFF',
            border: '2px solid #C8822A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 12px 28px rgba(200, 130, 42, 0.25)',
          }}
        >
          <Flame size={36} color="#C8822A" />
        </div>

        <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C8822A', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          Sacred Path Not Found
        </span>

        <h1
          className="heading-display"
          style={{
            fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
            color: '#1C1917',
            margin: '8px 0 14px',
            lineHeight: 1.15,
          }}
        >
          404: The Temple Gateway Has Shifted
        </h1>

        <p
          style={{
            color: '#6B635B',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            maxWidth: '560px',
            margin: '0 auto 32px',
          }}
        >
          Like a pilgrim pausing at the sanctified courtyard, the offering or page you seek has been moved or retired. Let us gently guide you back to pure fragrance and tranquility.
        </p>

        {/* Quick Sacred Search Bar */}
        <form
          onSubmit={handleSearch}
          style={{
            maxWidth: '460px',
            margin: '0 auto 36px',
            display: 'flex',
            gap: '8px',
            backgroundColor: '#FFF',
            padding: '6px',
            borderRadius: '9999px',
            border: '1px solid #D6CEBE',
            boxShadow: '0 6px 18px rgba(28, 25, 23, 0.08)',
          }}
        >
          <input
            type="text"
            placeholder="Search sandalwood, havan cups, dhoop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              padding: '10px 18px',
              fontSize: '0.9rem',
              backgroundColor: 'transparent',
              color: '#1C1917',
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Search size={15} /> Search
          </button>
        </form>

        {/* Popular Sacred Pathways Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '36px', textAlign: 'left' }}>
          {[
            { title: 'Bambooless Incense', subtitle: 'Mysore Sandalwood & Kesar', href: '/collections/bambooless-incense-sticks' },
            { title: 'Organic Havan Cups', subtitle: 'Gir Cow Ghee Yajna', href: '/collections/organic-havan-cups' },
            { title: 'Charcoal-Free Dhoop', subtitle: 'Guggul & Loban Cones', href: '/collections/charcoal-free-dhoop-cones' },
            { title: 'Curated Combos', subtitle: 'Complete Puja Hampers', href: '/collections/curated-puja-combos' },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              style={{
                backgroundColor: '#FFF',
                border: '1px solid #EAE3D6',
                borderRadius: '10px',
                padding: '16px',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-card-classic)',
                transition: 'all 0.2s ease',
                display: 'block',
              }}
            >
              <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '0.95rem', margin: '0 0 4px', color: '#1C1917' }}>
                {item.title}
              </h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#C8822A', fontWeight: 600 }}>
                Explore Collection →
              </p>
            </Link>
          ))}
        </div>

        {/* Return Button */}
        <div>
          <Link
            href="/"
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Home size={16} /> Return To Temple Home
          </Link>
        </div>
      </div>
    </div>
  );
}
