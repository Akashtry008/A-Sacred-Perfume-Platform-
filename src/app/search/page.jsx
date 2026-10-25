import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '@/lib/db';
import ProductCard from '@/components/storefront/ProductCard';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParam = new URLSearchParams(location.search).get('q') || '';
  const [q, setQ] = useState(queryParam);
  const [products, setProducts] = useState(() => {
    try {
      return db.getProducts({ search: queryParam, limit: 50 })?.products || [];
    } catch {
      return [];
    }
  });
  const [bestsellers, setBestsellers] = useState(() => {
    try {
      return db.getProducts({ limit: 4 })?.products || [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQ(queryParam);
    if (!queryParam.trim()) {
      // Fetch all products or bestsellers
      fetch('/api/products?limit=50')
        .then((r) => r.json())
        .then((d) => {
          if (d.products) setProducts(d.products);
        })
        .catch(() => {});
      return;
    }

    setLoading(true);
    fetch(`/api/products?search=${encodeURIComponent(queryParam.trim())}&limit=50`)
      .then((r) => r.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch((e) => console.log('Search fetch error:', e))
      .finally(() => setLoading(false));
  }, [queryParam]);

  useEffect(() => {
    fetch('/api/products?isBestseller=true&limit=4')
      .then((r) => r.json())
      .then((d) => {
        if (d.products && d.products.length > 0) setBestsellers(d.products);
        else {
          fetch('/api/products?limit=4')
            .then((r2) => r2.json())
            .then((d2) => {
              if (d2.products) setBestsellers(d2.products);
            });
        }
      })
      .catch(() => {});
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt; <span>Search Results</span>
        </div>

        {/* Search Header Form */}
        <div style={{ maxWidth: '640px', margin: '0 auto 48px', textAlign: 'center' }}>
          <h1 className="heading-display" style={{ fontSize: '2.25rem', marginBottom: '16px' }}>
            Product Search
          </h1>

          <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by fragrance, product, or ritual..."
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '8px',
                border: '1px solid #D4C9B8',
                backgroundColor: '#FFF',
                fontSize: '1rem',
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
              <Search size={18} /> {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {queryParam && (
            <p style={{ marginTop: '16px', color: '#6B635B', fontSize: '0.95rem' }}>
              Showing {products.length} {products.length === 1 ? 'sacred offering' : 'sacred offerings'} for: <strong>"{queryParam}"</strong>
            </p>
          )}
        </div>

        {/* Results or Empty State */}
        {products.length > 0 ? (
          <div className="grid-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div>
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                backgroundColor: '#FFF',
                borderRadius: '12px',
                border: '1px solid #EAE3D6',
                marginBottom: '64px',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
                No matches found for "{q}"
              </h3>
              <p style={{ color: '#6B635B', marginBottom: '16px' }}>
                Try popular searches: <strong>Sandalwood</strong>, <strong>Havan</strong>, <strong>Kesar</strong>, <strong>Dhoop</strong>, or <strong>Attar</strong>.
              </p>
            </div>

            <h3 className="heading-display" style={{ fontSize: '1.75rem', marginBottom: '24px', textAlign: 'center' }}>
              Explore Our Most Cherished Bestsellers
            </h3>
            <div className="grid-4">
              {bestsellers.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
