import React from 'react';
import Link from '@/components/common/Link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function BestsellersSection({ products, title, subtitle }) {
  if (!products || products.length === 0) return null;

  return (
    <section style={{ padding: '64px 0', backgroundColor: '#FAF8F5' }} aria-labelledby="bestsellers-heading">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C8822A', fontWeight: 600, marginBottom: '4px' }}>
              Most Cherished
            </p>
            <h2 id="bestsellers-heading" className="heading-display" style={{ fontSize: '2.25rem' }}>
              {title || 'VedaPavitra Bestsellers'}
            </h2>
            <p style={{ color: '#6B635B', fontSize: '0.95rem', marginTop: '4px' }}>
              {subtitle || 'Cherished in over 50,000 Hindu homes across India'}
            </p>
          </div>

          <Link
            href="/collections/bestsellers"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#C8822A',
              fontWeight: 600,
              fontSize: '0.9375rem',
            }}
          >
            View All Bestsellers <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
