import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { db } from '@/lib/db';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'All Sacred Collections | VedaPavitra',
  description: 'Explore our complete range of authentic Vedic incense, havan cups, and samagri collections.',
};

export default function CollectionsIndexPage() {
  const [categories, setCategories] = useState(() => db.getCategories() || []);
  const [collections, setCollections] = useState(() => db.getCollections() || []);

  useEffect(() => {
    fetch('/api/collections')
      .then((r) => r.json())
      .then((data) => {
        if (data.collections) {
          setCollections(data.collections);
          setCategories(data.collections);
        }
      })
      .catch((e) => console.log('Error fetching live collections:', e));
  }, []);

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '16px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>Collections</span>
        </div>

        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <h1 className="heading-display" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
            Sacred Collections
          </h1>
          <p style={{ color: '#6B635B', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Crafted strictly in accordance with Gandhashastra scriptures. Discover authentic bambooless agarbatti and organic havan essentials.
          </p>
        </div>

        {/* Categories Grid */}
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', marginBottom: '24px' }}>
          Browse By Product Category
        </h2>
        <div className="grid-3" style={{ marginBottom: '64px' }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className="category-card"
              style={{ aspectRatio: '16 / 10' }}
            >
              <img src={cat.imageUrl} alt={cat.name} loading="lazy" />
              <div className="category-card-overlay">
                <h3>{cat.name}</h3>
                <p style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  View Products <ArrowRight size={14} />
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Curated Merchandising Collections */}
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', marginBottom: '24px' }}>
          Featured Curations
        </h2>
        <div className="grid-3">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              style={{
                backgroundColor: '#FFF',
                border: '1px solid #EAE3D6',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-card-classic)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', marginBottom: '8px', color: '#1C1917' }}>
                {col.title}
              </h3>
              <p style={{ color: '#6B635B', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, marginBottom: '16px' }}>
                {col.description}
              </p>
              <span style={{ color: '#C8822A', fontWeight: 600, fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Explore Collection <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
