import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { flyToDestination } from '@/lib/flyAnimation';
import { db } from '@/lib/db';

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      try {
        let allProducts = [];
        try {
          const res = await fetch('/api/products?limit=100');
          if (res.ok) {
            const data = await res.json();
            allProducts = data.products || data.data?.products || (Array.isArray(data) ? data : []);
          }
        } catch (err) {}

        // Fallback to local catalog if API is offline or returned empty
        if (!allProducts || allProducts.length === 0) {
          try {
            const seed = db.getProducts({ limit: 100 });
            allProducts = seed.products || seed || [];
          } catch (e) {}
        }

        // Match against saved wishlist IDs with string-safe comparison
        const matched = (allProducts || []).filter((p) => {
          const pId = String(p.id || '');
          const pMongoId = String(p._id || '');
          const pSlug = String(p.slug || '');
          return wishlistIds.some((wid) => {
            const widStr = String(wid);
            return widStr === pId || widStr === pMongoId || widStr === pSlug;
          });
        });

        setProducts(matched);
      } catch (e) {
        console.error('Failed to load wishlist products:', e);
      } finally {
        setLoading(false);
      }
    }
    loadWishlistProducts();
  }, [wishlistIds]);

  return (
    <div style={{ padding: '36px 0 80px', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8125rem', color: '#6B635B', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#1C1917' }}>Home</Link> &gt;{' '}
          <Link href="/account" style={{ color: '#1C1917' }}>My Account</Link> &gt;{' '}
          <span>Saved Wishlist</span>
        </div>

        <h1 className="heading-display" style={{ fontSize: '2.25rem', marginBottom: '28px' }}>
          Saved Wishlist ({products.length} {products.length === 1 ? 'item' : 'items'})
        </h1>

        {products.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFF',
              border: '1px solid #EAE3D6',
              borderRadius: '12px',
              padding: '64px 20px',
              textAlign: 'center',
            }}
          >
            <Heart size={48} color="#D4C5B3" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
              Your wishlist is currently empty
            </h3>
            <p style={{ color: '#6B635B', marginBottom: '24px' }}>
              Explore our collections and tap the heart icon on any product to save it.
            </p>
            <Link href="/collections" className="btn-primary">
              Discover Sacred Fragrances
            </Link>
          </div>
        ) : (
          <div className="grid-3">
            {products.map((p) => {
              const defaultVar = p.variants?.[0] || {};
              return (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: '#FFF',
                    border: '1px solid #EAE3D6',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '1 / 1', backgroundColor: '#F6F1EA' }}>
                    <img
                      src={
                        (typeof p.images?.[0] === 'string' ? p.images[0] : p.images?.[0]?.url) ||
                        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      onClick={() => toggleWishlist(p.id, p.title)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9B3828',
                        cursor: 'pointer',
                        border: '1px solid #EAE3D6',
                      }}
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>
                      <Link href={`/products/${p.slug}`}>{p.title}</Link>
                    </h3>

                    <div style={{ marginTop: 'auto', marginBottom: '14px', fontWeight: 700, fontSize: '1.1rem', color: '#1C1917' }}>
                      {formatPrice(defaultVar.price || p.price || 299)}
                    </div>

                    <button
                      onClick={(e) => {
                        flyToDestination(e, 'cart');
                        addToCart(p.id, defaultVar.id || 'default-var', 1);
                      }}
                      className="btn-primary btn-full"
                      style={{ fontSize: '0.8125rem', padding: '10px' }}
                    >
                      <ShoppingBag size={15} /> Move to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
