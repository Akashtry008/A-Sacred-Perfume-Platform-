import React, { useState, useEffect, useRef } from 'react';
import Link from '@/components/common/Link';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  X,
  Flame,
  Star,
  Layers,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { db } from '@/lib/db';

const POPULAR_SEARCHES = [
  'Mysore Sandalwood Incense',
  'Gir Cow Ghee Havan Cups',
  'Handcrafted Brass Akhand Diya',
  'Bhimseni Pure Camphor',
  'Kannauj Rose Attar',
  'Sampoorna Daily Pooja Combo',
];

export default function PredictiveSearchDropdown({
  query = '',
  isOpen = false,
  onClose,
  onSelectSearch,
}) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({
    products: [],
    collections: [],
    blogs: [],
  });

  // Debounced search query fetch
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults({ products: [], collections: [], blogs: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setResults({
            products: data.products || [],
            collections: data.collections || [],
            blogs: data.blogs || [],
          });
        } else {
          // Client-side fallback using db.js
          const localProducts = db.getProducts({ search: trimmed, limit: 6 })?.products || [];
          const localBlogs = (db.getBlogs() || [])
            .filter((b) => b.title.toLowerCase().includes(trimmed.toLowerCase()))
            .slice(0, 2);
          setResults({ products: localProducts, collections: [], blogs: localBlogs });
        }
      } catch (err) {
        // Local fallback
        const localProducts = db.getProducts({ search: trimmed, limit: 6 })?.products || [];
        setResults({ products: localProducts, collections: [], blogs: [] });
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        // check if target is search input or toggle button
        const searchInput = document.getElementById('header-search-input');
        if (searchInput && searchInput.contains(e.target)) return;
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;
  const hasProducts = results.products.length > 0;
  const hasCollections = results.collections.length > 0;
  const hasBlogs = results.blogs.length > 0;
  const hasAnyResults = hasProducts || hasCollections || hasBlogs;

  const handleItemClick = () => {
    onClose?.();
  };

  const handleViewAll = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose?.();
    }
  };

  return (
    <div
      ref={dropdownRef}
      id="predictive-search-dropdown"
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(200, 130, 42, 0.08)',
        border: '1px solid #EAE3D6',
        borderTop: 'none',
        zIndex: 999,
        maxHeight: 'min(580px, 80vh)',
        overflowY: 'auto',
      }}
    >
      <div className="container" style={{ padding: '20px 24px' }}>
        {/* State 1: No query entered yet -> Show Trending Devotional Searches */}
        {!hasQuery && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#C8822A',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '14px',
              }}
            >
              <TrendingUp size={16} /> Popular Devotional Searches
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onSelectSearch?.(term)}
                  style={{
                    backgroundColor: '#FAF7F2',
                    border: '1px solid #E7E5E4',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    color: '#292524',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FAF0E4';
                    e.currentTarget.style.borderColor = '#C8822A';
                    e.currentTarget.style.color = '#C8822A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FAF7F2';
                    e.currentTarget.style.borderColor = '#E7E5E4';
                    e.currentTarget.style.color = '#292524';
                  }}
                >
                  <Search size={12} color="#A8A29E" />
                  {term}
                </button>
              ))}
            </div>

            {/* Quick Ritual Categories */}
            <div
              style={{
                borderTop: '1px solid #F5F5F4',
                paddingTop: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: '0.82rem',
                color: '#78716C',
              }}
            >
              <span style={{ fontWeight: 600, color: '#1C1917' }}>Quick Explore:</span>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link
                  href="/collections/bestsellers"
                  onClick={handleItemClick}
                  style={{ color: '#C8822A', textDecoration: 'none', fontWeight: 600 }}
                >
                  ★ Bestsellers
                </Link>
                <Link
                  href="/collections/bambooless-incense-sticks"
                  onClick={handleItemClick}
                  style={{ color: '#57534E', textDecoration: 'none' }}
                >
                  Bambooless Incense
                </Link>
                <Link
                  href="/collections/curated-puja-combos"
                  onClick={handleItemClick}
                  style={{ color: '#57534E', textDecoration: 'none' }}
                >
                  Puja Combos
                </Link>
                <Link
                  href="/track-order"
                  onClick={handleItemClick}
                  style={{ color: '#57534E', textDecoration: 'none' }}
                >
                  Track Devotee Order
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Query entered -> Results or Loading */}
        {hasQuery && (
          <div>
            {isLoading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '24px 0',
                  color: '#C8822A',
                  fontSize: '0.9rem',
                }}
              >
                <Loader2 size={18} className="spin-icon" />
                <span>Searching sanctified store...</span>
              </div>
            )}

            {!isLoading && !hasAnyResults && (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <Search size={32} color="#D6D3D1" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ fontSize: '1rem', color: '#1C1917', margin: '0 0 6px' }}>
                  No sacred items matching &ldquo;{query}&rdquo;
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#78716C', margin: '0 0 16px' }}>
                  Try searching for pure ingredients like <em>Chandan</em>, <em>Ghee Havan Cups</em>, <em>Diya</em>, or <em>Attar</em>.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {['Sandalwood', 'Havan Cups', 'Brass Diya'].map((term) => (
                    <button
                      key={term}
                      onClick={() => onSelectSearch?.(term)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        border: '1px solid #D6D3D1',
                        backgroundColor: '#FAF7F2',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        color: '#44403C',
                      }}
                    >
                      Search &ldquo;{term}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && hasAnyResults && (
              <div style={{ display: 'grid', gridTemplateColumns: hasBlogs ? '1.8fr 1fr' : '1fr', gap: '28px' }}>
                {/* Column 1: Matching Products */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid #F5F5F4',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#78716C',
                      }}
                    >
                      Sacred Products ({results.products.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleViewAll}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#C8822A',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      View All Results &rarr;
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {results.products.map((p) => {
                      const primaryImg =
                        p.images?.[0]?.url ||
                        p.imageUrl ||
                        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80';
                      const defaultVariant = p.variants?.[0] || {};
                      const price = defaultVariant.price || p.price || 0;
                      const comparePrice = defaultVariant.compareAtPrice || p.compareAtPrice || 0;

                      return (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          onClick={handleItemClick}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            backgroundColor: '#FAF7F2',
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                            border: '1px solid transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFF';
                            e.currentTarget.style.borderColor = '#C8822A';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FAF7F2';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.transform = 'none';
                          }}
                        >
                          {/* Thumbnail */}
                          <div
                            style={{
                              width: '54px',
                              height: '54px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              backgroundColor: '#E7E5E4',
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={primaryImg}
                              alt={p.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                color: '#1C1917',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {p.title}
                            </div>
                            <div
                              style={{
                                fontSize: '0.78rem',
                                color: '#78716C',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                marginTop: '2px',
                              }}
                            >
                              {p.subtitle || p.shortDesc || '100% Bamboo-Free & Consecrated'}
                            </div>
                          </div>

                          {/* Price & Rating */}
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1C1917' }}>
                              {formatPrice(price)}
                            </div>
                            {comparePrice > price && (
                              <div
                                style={{
                                  fontSize: '0.75rem',
                                  color: '#A8A29E',
                                  textDecoration: 'line-through',
                                }}
                              >
                                {formatPrice(comparePrice)}
                              </div>
                            )}
                          </div>

                          <ChevronRight size={16} color="#C8822A" style={{ flexShrink: 0 }} />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: Matching Shastra Wisdom & Blogs */}
                {hasBlogs && (
                  <div>
                    <div
                      style={{
                        marginBottom: '12px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #F5F5F4',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#C8822A',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <BookOpen size={14} /> Shastra & Journal Insights
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {results.blogs.map((b) => (
                        <Link
                          key={b.id || b.slug}
                          href={`/blogs/${b.slug}`}
                          onClick={handleItemClick}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '10px',
                            backgroundColor: '#FAF0E4',
                            border: '1px solid #EAE3D6',
                            textDecoration: 'none',
                            display: 'block',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F5E6D0';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FAF0E4';
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: '#C8822A',
                              textTransform: 'uppercase',
                              display: 'inline-block',
                              marginBottom: '4px',
                            }}
                          >
                            {b.category || 'Vedic Shastra'}
                          </span>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: '#1C1917',
                              lineHeight: 1.35,
                              marginBottom: '4px',
                            }}
                          >
                            {b.title}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: '#78716C',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {b.excerpt}
                          </div>
                          <div
                            style={{
                              marginTop: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#C8822A',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            Read Shastra Guide &rarr;
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Footer Action */}
            {hasAnyResults && (
              <div
                style={{
                  marginTop: '18px',
                  paddingTop: '14px',
                  borderTop: '1px solid #EAE3D6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: '#78716C' }}>
                  Press <kbd style={{ padding: '2px 6px', background: '#F5F5F4', borderRadius: '4px', border: '1px solid #D6D3D1', fontSize: '0.75rem' }}>Enter</kbd> to view full catalog search
                </div>

                <button
                  type="button"
                  onClick={handleViewAll}
                  className="btn btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '8px',
                  }}
                >
                  <span>See All Results for &ldquo;{query}&rdquo;</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
